import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { token } = params;

        const patient = await prisma.patient.findUnique({
            where: { inviteToken: token },
            include: {
                project: {
                    include: {
                        videos: true,
                        summary: true,
                        faqs: { orderBy: { orderIndex: 'asc' } },
                        documents: {
                            where: {
                                type: { in: ['PI_SHEET', 'PATIENT_CONTRACT'] },
                            },
                            orderBy: { version: 'desc' },
                        },
                    },
                },
                consents: true,
            },
        });

        if (!patient) {
            return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });
        }

        // Update last activity
        await prisma.patient.update({
            where: { id: patient.id },
            data: { lastActivity: new Date(), inviteStatus: 'OPENED' },
        });

        // Parse summary sections
        let summarySections = {};
        if (patient.project.summary?.sections) {
            try {
                summarySections = typeof patient.project.summary.sections === 'string'
                    ? JSON.parse(patient.project.summary.sections)
                    : patient.project.summary.sections;
            } catch { summarySections = {}; }
        }

        // --- Mock data for trial document, quiz, and summary videos ---
        const isOnco = patient.project.id === 'proj-onco-001';

        const trialDocument = isOnco
            ? '/demo/docs/oncovision-trial-info.html'
            : '/demo/docs/cardiobridge-trial-info.html';

        const summaryVideos = isOnco ? {
            why: { title: 'Understanding why this trial matters', duration: '2:30' },
            what: { title: 'What your participation involves', duration: '3:15' },
            risks: { title: 'Risks and benefits explained', duration: '2:45' },
            timeline: { title: 'Your visit schedule and timeline', duration: '1:50' },
            next: { title: 'Next steps after this page', duration: '1:30' },
        } : {
            why: { title: 'About the CardioBridge device', duration: '2:45' },
            what: { title: 'The device placement procedure', duration: '3:30' },
            risks: { title: 'Understanding the risks involved', duration: '2:50' },
            timeline: { title: 'Your 12-month study schedule', duration: '2:00' },
            next: { title: 'Getting started with the study', duration: '1:45' },
        };

        const quizQuestions = isOnco ? [
            {
                id: 'q1',
                question: 'What type of cancer is OV-201 being tested for?',
                options: ['Breast cancer', 'Non-small cell lung cancer (NSCLC)', 'Colon cancer', 'Skin cancer'],
                correctIndex: 1,
            },
            {
                id: 'q2',
                question: 'How often will you receive the OV-201 treatment?',
                options: ['Every day', 'Once a week', 'Every three weeks', 'Once a month'],
                correctIndex: 2,
            },
            {
                id: 'q3',
                question: 'Approximately how long does the study last?',
                options: ['3 months', '6 months', '9 months', '2 years'],
                correctIndex: 2,
            },
            {
                id: 'q4',
                question: 'Can you withdraw from the study at any time?',
                options: [
                    'No, once enrolled you must complete the study',
                    'Only with your doctor\'s permission',
                    'Yes, at any time without giving a reason',
                    'Only within the first month',
                ],
                correctIndex: 2,
            },
            {
                id: 'q5',
                question: 'Will you need to pay for the study treatment?',
                options: ['Yes, at a subsidised rate', 'Yes, full price', 'No, the treatment and tests are free', 'Only for the medication'],
                correctIndex: 2,
            },
        ] : [
            {
                id: 'q1',
                question: 'What condition is the CardioBridge device designed to help with?',
                options: ['Lung disease', 'Chronic heart failure', 'Diabetes', 'High blood pressure'],
                correctIndex: 1,
            },
            {
                id: 'q2',
                question: 'How is the CardioBridge device placed?',
                options: ['Open-heart surgery', 'Minimally invasive catheter procedure', 'External attachment to the chest', 'Oral medication'],
                correctIndex: 1,
            },
            {
                id: 'q3',
                question: 'How long does the device placement procedure typically take?',
                options: ['15 minutes', '1–2 hours', '4–6 hours', 'A full day'],
                correctIndex: 1,
            },
            {
                id: 'q4',
                question: 'How long is the total study follow-up period?',
                options: ['3 months', '6 months', '12 months', '24 months'],
                correctIndex: 2,
            },
            {
                id: 'q5',
                question: 'Will the CardioBridge device replace your current heart failure medications?',
                options: ['Yes, completely', 'Yes, partially', 'No, it works alongside existing medications', 'Only some medications will be stopped'],
                correctIndex: 2,
            },
        ];

        return NextResponse.json({
            patientId: patient.id,
            firstName: patient.firstName,
            hasConsented: patient.consentStatus === 'CONSENTED',
            project: {
                id: patient.project.id,
                name: patient.project.name,
                sponsor: patient.project.sponsor,
                therapeuticArea: patient.project.therapeuticArea,
                description: patient.project.description,
            },
            video: patient.project.videos[0] || null,
            summary: summarySections,
            summaryVideos,
            trialDocument,
            quizQuestions,
            faqs: patient.project.faqs,
            documents: patient.project.documents,
        });
    } catch (error) {
        console.error('Patient page error:', error);
        return NextResponse.json({ error: 'Failed to load page' }, { status: 500 });
    }
}
