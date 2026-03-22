import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { token } = params;
        const body = await request.json();

        const patient = await prisma.patient.findUnique({
            where: { inviteToken: token },
        });

        if (!patient) {
            return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
        }

        // Find contract document for reference
        const contractDoc = await prisma.document.findFirst({
            where: { projectId: patient.projectId, type: 'PATIENT_CONTRACT' },
            orderBy: { version: 'desc' },
        });

        const consent = await prisma.consent.create({
            data: {
                patientId: patient.id,
                projectId: patient.projectId,
                readUnderstood: body.readUnderstood,
                acceptTerms: body.acceptTerms,
                signatureName: body.signatureName,
                signatureData: body.signatureData || '',
                contractDocId: contractDoc?.id || null,
            },
        });

        // Update patient status
        await prisma.patient.update({
            where: { id: patient.id },
            data: { consentStatus: 'CONSENTED' },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'CONSENT_SUBMITTED',
                entityType: 'Consent',
                entityId: consent.id,
                patientId: patient.id,
                projectId: patient.projectId,
                details: `Consent submitted by ${patient.firstName} ${patient.lastName}. Signature: ${body.signatureName}`,
            },
        });

        return NextResponse.json({
            success: true,
            consentId: consent.id,
            signedAt: consent.signedAt,
        });
    } catch (error) {
        console.error('Consent error:', error);
        return NextResponse.json({ error: 'Failed to submit consent' }, { status: 500 });
    }
}
