import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';

function generatePatientDisplayId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid confusing chars like 0/O, 1/I
    let id = 'PT-';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const patients = await prisma.patient.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { consents: true } },
            },
        });
        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { projectId } = params;
        const {
            firstName,
            lastName,
            email,
            phone,
            patientExternalId,
            privacyMode,
            outreachMethod,
            generateToken,
        } = await request.json();

        const isAnonymous = privacyMode === 'ANONYMOUS';

        // For non-anonymous patients, name and email are required
        if (!isAnonymous && (!firstName || !lastName || !email)) {
            return NextResponse.json(
                { error: 'First name, last name and email are required for non-anonymous patients' },
                { status: 400 }
            );
        }

        const inviteToken = generateToken ? uuidv4().replace(/-/g, '').slice(0, 16) : null;
        const patientDisplayId = generatePatientDisplayId();

        const patient = await prisma.patient.create({
            data: {
                projectId,
                patientDisplayId,
                firstName: firstName || '',
                lastName: lastName || '',
                email: email || '',
                phone: phone || '',
                patientExternalId: patientExternalId || '',
                privacyMode: privacyMode || 'NON_ANONYMOUS',
                outreachMethod: outreachMethod || 'DIRECT_OUTREACH',
                inviteToken,
                inviteStatus: inviteToken ? 'SENT' : 'PENDING',
            },
        });

        // Audit log
        const user = await prisma.user.findFirst();
        const displayName = isAnonymous
            ? `Anonymous patient ${patientDisplayId}`
            : `${firstName} ${lastName}`;

        await prisma.auditLog.create({
            data: {
                action: 'PATIENT_INVITE',
                entityType: 'Patient',
                entityId: patient.id,
                userId: user?.id,
                projectId,
                patientId: patient.id,
                details: `Patient added: ${displayName}${inviteToken ? ' (invite generated)' : ''}`,
            },
        });

        return NextResponse.json(patient, { status: 201 });
    } catch (error) {
        console.error('Patient creation error:', error);
        return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 });
    }
}
