import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const summary = await prisma.summary.findUnique({ where: { projectId } });
        return NextResponse.json(summary || { sections: '{}' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { projectId } = params;
        const { sections } = await request.json();

        const summary = await prisma.summary.upsert({
            where: { projectId },
            update: { sections: typeof sections === 'string' ? sections : JSON.stringify(sections) },
            create: { projectId, sections: typeof sections === 'string' ? sections : JSON.stringify(sections) },
        });

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Summary update error:', error);
        return NextResponse.json({ error: 'Failed to update summary' }, { status: 500 });
    }
}
