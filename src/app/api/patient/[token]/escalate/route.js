import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { token } = params;
        const { message } = await request.json();

        const patient = await prisma.patient.findUnique({
            where: { inviteToken: token },
        });

        if (!patient) {
            return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
        }

        const escalation = await prisma.escalation.create({
            data: {
                patientId: patient.id,
                projectId: patient.projectId,
                message,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'ESCALATION_SUBMITTED',
                entityType: 'Escalation',
                entityId: escalation.id,
                patientId: patient.id,
                projectId: patient.projectId,
                details: `Escalation from ${patient.firstName} ${patient.lastName}: ${message.substring(0, 100)}`,
            },
        });

        return NextResponse.json({ success: true, escalationId: escalation.id });
    } catch (error) {
        console.error('Escalation error:', error);
        return NextResponse.json({ error: 'Failed to submit question' }, { status: 500 });
    }
}
