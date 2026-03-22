import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { projectId } = params;
        const formData = await request.formData();
        const file = formData.get('file');
        const type = formData.get('type'); // PI_SHEET | PROTOCOL | PATIENT_CONTRACT

        if (!file || !type) {
            return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
        }

        // Create upload directory
        const uploadDir = path.join(process.cwd(), 'uploads', projectId);
        await mkdir(uploadDir, { recursive: true });

        // Get version number
        const existing = await prisma.document.findMany({
            where: { projectId, type },
            orderBy: { version: 'desc' },
        });
        const version = (existing[0]?.version || 0) + 1;

        // Save file
        const filename = `${type.toLowerCase()}_v${version}_${file.name}`;
        const filepath = path.join(uploadDir, filename);
        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        // Get first user for demo
        const user = await prisma.user.findFirst();

        const document = await prisma.document.create({
            data: {
                projectId,
                type,
                filename: file.name,
                filepath: `/uploads/${projectId}/${filename}`,
                version,
                uploadedById: user?.id || 'user-admin-001',
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'DOCUMENT_UPLOAD',
                entityType: 'Document',
                entityId: document.id,
                userId: user?.id,
                projectId,
                details: `${type} uploaded: ${file.name} (v${version})`,
            },
        });

        return NextResponse.json(document, { status: 201 });
    } catch (error) {
        console.error('Document upload error:', error);
        return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { projectId } = params;
        const documents = await prisma.document.findMany({
            where: { projectId },
            orderBy: { uploadedAt: 'desc' },
        });
        return NextResponse.json(documents);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}
