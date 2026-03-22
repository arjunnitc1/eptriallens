import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { projectId, patientId } = params;

        const token = uuidv4().replace(/-/g, '').slice(0, 16);

        const patient = await prisma.patient.update({
            where: { id: patientId },
            data: {
                inviteToken: token,
                inviteStatus: 'SENT',
            },
        });

        // Audit log
        const user = await prisma.user.findFirst();
        await prisma.auditLog.create({
            data: {
                action: 'PATIENT_INVITE',
                entityType: 'Patient',
                entityId: patientId,
                userId: user?.id,
                projectId,
                patientId,
                details: `Invite link generated for ${patient.firstName} ${patient.lastName}`,
            },
        });

        return NextResponse.json({ token, link: `/p/${token}` });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate invite' }, { status: 500 });
    }
}
