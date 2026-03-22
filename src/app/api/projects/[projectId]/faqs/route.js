import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const faqs = await prisma.fAQ.findMany({
            where: { projectId },
            orderBy: { orderIndex: 'asc' },
        });
        return NextResponse.json(faqs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { projectId } = params;
        const { question, answer } = await request.json();

        const maxOrder = await prisma.fAQ.findFirst({
            where: { projectId },
            orderBy: { orderIndex: 'desc' },
        });

        const faq = await prisma.fAQ.create({
            data: {
                projectId,
                question,
                answer,
                orderIndex: (maxOrder?.orderIndex || 0) + 1,
            },
        });

        return NextResponse.json(faq, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id, question, answer, orderIndex } = await request.json();

        const faq = await prisma.fAQ.update({
            where: { id },
            data: { question, answer, orderIndex },
        });

        return NextResponse.json(faq);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await prisma.fAQ.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
    }
}
