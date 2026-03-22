import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                documents: { orderBy: { uploadedAt: 'desc' } },
                videos: true,
                summary: true,
                faqs: { orderBy: { orderIndex: 'asc' } },
                patients: { orderBy: { createdAt: 'desc' } },
                escalations: {
                    orderBy: { createdAt: 'desc' },
                    include: { patient: { select: { firstName: true, lastName: true, email: true } } },
                },
                createdBy: { select: { name: true, email: true } },
                _count: { select: { patients: true, chatMessages: true } },
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('GET project error:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { projectId } = params;
        const body = await request.json();

        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                name: body.name,
                therapeuticArea: body.therapeuticArea,
                trialPhase: body.trialPhase,
                sponsor: body.sponsor,
                description: body.description,
                languages: body.languages,
                status: body.status,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('PUT project error:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}
