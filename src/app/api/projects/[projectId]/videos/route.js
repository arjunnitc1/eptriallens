import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { projectId } = params;
        const formData = await request.formData();
        const file = formData.get('file');
        const url = formData.get('url');
        const title = formData.get('title') || '';
        const sourceType = file ? 'UPLOADED' : 'EXTERNAL_URL';

        let filepath = '';
        if (file) {
            const uploadDir = path.join(process.cwd(), 'uploads', projectId);
            await mkdir(uploadDir, { recursive: true });
            const filename = `video_${Date.now()}_${file.name}`;
            filepath = `/uploads/${projectId}/${filename}`;
            const bytes = await file.arrayBuffer();
            await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
        }

        const video = await prisma.video.create({
            data: {
                projectId,
                sourceType,
                filepath,
                url: url || '',
                title,
            },
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error('Video upload error:', error);
        return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const videos = await prisma.video.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}
