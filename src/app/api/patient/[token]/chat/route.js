import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple in-memory rate limiter
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(token) {
    const now = Date.now();
    const entry = rateLimits.get(token);

    if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
        rateLimits.set(token, { start: now, count: 1 });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false;
    }

    entry.count++;
    return true;
}

export async function POST(request, { params }) {
    try {
        const { token } = params;

        // Rate limiting
        if (!checkRateLimit(token)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a moment.' },
                { status: 429 }
            );
        }

        const patient = await prisma.patient.findUnique({
            where: { inviteToken: token },
            include: {
                project: {
                    include: {
                        faqs: true,
                        summary: true,
                    },
                },
            },
        });

        if (!patient) {
            return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
        }

        const { message } = await request.json();

        // Save user message
        await prisma.chatMessage.create({
            data: {
                patientId: patient.id,
                projectId: patient.projectId,
                role: 'USER',
                content: message,
            },
        });

        // Count messages for escalation threshold
        const messageCount = await prisma.chatMessage.count({
            where: { patientId: patient.id, role: 'USER' },
        });

        // Deterministic stub: search FAQs and summary
        const lowerMsg = message.toLowerCase();
        let response = '';
        let suggestEscalation = messageCount >= 3;

        // Search FAQs
        const matchingFaq = patient.project.faqs.find(
            (faq) =>
                faq.question.toLowerCase().includes(lowerMsg) ||
                lowerMsg.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
                faq.answer.toLowerCase().includes(lowerMsg)
        );

        if (matchingFaq) {
            response = matchingFaq.answer;
        } else {
            // Search summary sections
            let summaryObj = {};
            try {
                summaryObj = typeof patient.project.summary?.sections === 'string'
                    ? JSON.parse(patient.project.summary.sections)
                    : patient.project.summary?.sections || {};
            } catch { summaryObj = {}; }

            const sectionLabels = {
                why: 'Why this trial',
                what: 'What participation involves',
                risks: 'Risks and benefits',
                timeline: 'Timeline and visits',
                next: 'What happens next',
            };

            let matchedSection = null;
            for (const [key, content] of Object.entries(summaryObj)) {
                if (content && (content.toLowerCase().includes(lowerMsg) || lowerMsg.includes(key))) {
                    matchedSection = { key, label: sectionLabels[key] || key, content };
                    break;
                }
            }

            // Keyword-based matching for common questions
            if (!matchedSection) {
                const keywordMap = {
                    'risk': 'risks',
                    'side effect': 'risks',
                    'danger': 'risks',
                    'safe': 'risks',
                    'how long': 'timeline',
                    'visit': 'timeline',
                    'duration': 'timeline',
                    'schedule': 'timeline',
                    'why': 'why',
                    'purpose': 'why',
                    'reason': 'why',
                    'what': 'what',
                    'involve': 'what',
                    'do i': 'what',
                    'next': 'next',
                    'step': 'next',
                    'after': 'next',
                };

                for (const [keyword, sectionKey] of Object.entries(keywordMap)) {
                    if (lowerMsg.includes(keyword) && summaryObj[sectionKey]) {
                        matchedSection = { key: sectionKey, label: sectionLabels[sectionKey], content: summaryObj[sectionKey] };
                        break;
                    }
                }
            }

            if (matchedSection) {
                response = `Based on the "${matchedSection.label}" section of the study information:\n\n${matchedSection.content}`;
            } else {
                response = "I'm sorry, I couldn't find a specific answer to that question in the study materials. I'd recommend reviewing the summary sections above, or you can contact the clinical team directly for more detailed information.";
                suggestEscalation = true;
            }
        }

        // Save assistant response
        await prisma.chatMessage.create({
            data: {
                patientId: patient.id,
                projectId: patient.projectId,
                role: 'ASSISTANT',
                content: response,
            },
        });

        return NextResponse.json({
            response,
            suggestEscalation,
            messageCount,
        });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Chat service unavailable' }, { status: 500 });
    }
}
