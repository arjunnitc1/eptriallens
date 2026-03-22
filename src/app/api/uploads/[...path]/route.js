import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const filePath = path.join(process.cwd(), 'uploads', ...params.path);
        const file = await readFile(filePath);

        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
        };

        return new NextResponse(file, {
            headers: {
                'Content-Type': mimeTypes[ext] || 'application/octet-stream',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
