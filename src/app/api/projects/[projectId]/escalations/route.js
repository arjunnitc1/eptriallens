import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const escalations = await prisma.escalation.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { firstName: true, lastName: true, email: true } },
            },
        });
        return NextResponse.json(escalations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch escalations' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id, staffResponse, status } = await request.json();

        const escalation = await prisma.escalation.update({
            where: { id },
            data: {
                staffResponse,
                status: status || 'RESOLVED',
                resolvedAt: status === 'RESOLVED' ? new Date() : undefined,
            },
        });

        // Audit log
        const user = await prisma.user.findFirst();
        await prisma.auditLog.create({
            data: {
                action: 'STAFF_RESPONSE',
                entityType: 'Escalation',
                entityId: id,
                userId: user?.id,
                projectId: params.projectId,
                details: `Staff responded to escalation`,
            },
        });

        return NextResponse.json(escalation);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update escalation' }, { status: 500 });
    }
}
