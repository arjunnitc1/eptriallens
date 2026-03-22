import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                _count: {
                    select: {
                        patients: true,
                    },
                },
                patients: {
                    select: { consentStatus: true },
                },
                createdBy: {
                    select: { name: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        const data = projects.map((p) => ({
            id: p.id,
            name: p.name,
            sponsor: p.sponsor,
            status: p.status,
            therapeuticArea: p.therapeuticArea,
            trialPhase: p.trialPhase,
            updatedAt: p.updatedAt,
            projectLead: p.createdBy?.name || '—',
            patientsInvited: p._count.patients,
            patientsConsented: p.patients.filter((pt) => pt.consentStatus === 'CONSENTED').length,
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error('GET /api/projects error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, therapeuticArea, trialPhase, sponsor, description, languages } = body;

        if (!name) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        // Get the first admin user for demo purposes
        const user = await prisma.user.findFirst({ where: { role: 'RESEARCHER_ADMIN' } });
        const userId = user?.id || 'user-admin-001';

        const project = await prisma.project.create({
            data: {
                name,
                therapeuticArea: therapeuticArea || '',
                trialPhase: trialPhase || '',
                sponsor: sponsor || '',
                description: description || '',
                languages: languages || 'English',
                createdById: userId,
            },
        });

        // Create default summary
        await prisma.summary.create({
            data: {
                projectId: project.id,
                sections: JSON.stringify({
                    why: '',
                    what: '',
                    risks: '',
                    timeline: '',
                    next: '',
                }),
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'PROJECT_CREATED',
                entityType: 'Project',
                entityId: project.id,
                userId,
                projectId: project.id,
                details: `Project created: ${name}`,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('POST /api/projects error:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
