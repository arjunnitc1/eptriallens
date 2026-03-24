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

        const { message, lang = 'en' } = await request.json();

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

        // Translate FAQs
        const translatedFaqs = patient.project.faqs.map(faq => {
            const translations = {
                'What is OV-201?': {
                    es: { q: '¿Qué es OV-201?', a: 'OV-201 es una nueva terapia dirigida diseñada para bloquear vías moleculares específicas que ayudan a las células cancerosas a crecer. Se está desarrollando como un posible tratamiento para el cáncer de pulmón de células no pequeñas avanzado.' },
                    fr: { q: 'Qu\'est-ce que l\'OV-201 ?', a: 'L\'OV-201 est une nouvelle thérapie ciblée conçue pour bloquer des voies moléculaires spécifiques qui aident les cellules cancéreuses à se développer. Il est développé comme traitement potentiel du cancer du poumon non à petites cellules avancé.' }
                },
                'Am I eligible to participate?': {
                    es: { q: '¿Soy elegible para participar?', a: 'Puede ser elegible si tiene 18 años o más, le han diagnosticado CPCNP avanzado y ha recibido previamente tratamiento de inmunoterapia. El equipo de investigación llevará a cabo una evaluación de detección para confirmar su elegibilidad.' },
                    fr: { q: 'Suis-je éligible pour participer ?', a: 'Vous pourriez être éligible si vous avez 18 ans ou plus, avez reçu un diagnostic de CPNPC avancé et avez déjà reçu un traitement d\'immunothérapie. L\'équipe de recherche procédera à une évaluation de sélection pour confirmer votre éligibilité.' }
                },
                'Will I definitely receive the treatment?': {
                    es: { q: '¿Seguro que recibiré el tratamiento?', a: 'En este ensayo, todos los participantes recibirán OV-201. No hay grupo de placebo. Sin embargo, como con cualquier tratamiento en investigación, no podemos garantizar que sea beneficioso para usted personalmente.' },
                    fr: { q: 'Vais-je certainement recevoir le traitement ?', a: 'Dans cet essai, tous les participants recevront l\'OV-201. Il n\'y a pas de groupe placebo. Cependant, comme pour tout traitement expérimental, nous ne pouvons pas garantir qu\'il vous sera bénéfique personnellement.' }
                },
                'What happens if I experience side effects?': {
                    es: { q: '¿Qué sucede si experimento efectos secundarios?', a: 'Nuestro equipo médico lo monitoreará de cerca durante todo el estudio. Si experimenta algún efecto secundario, se manejará de acuerdo con los protocolos médicos establecidos. Puede comunicarse con el equipo del estudio en cualquier momento si tiene inquietudes.' },
                    fr: { q: 'Que se passe-t-il si j\'ai des effets secondaires ?', a: 'Notre équipe médicale vous surveillera de près tout au long de l\'étude. Si vous ressentez des effets secondaires, ils seront gérés conformément aux protocoles médicaux établis. Vous pouvez contacter l\'équipe de l\'étude à tout moment si vous avez des préoccupations.' }
                },
                'Can I leave the study at any time?': {
                    es: { q: '¿Puedo abandonar el estudio en cualquier momento?', a: 'Sí, absolutamente. La participación es completamente voluntaria. Puede retirarse del estudio en cualquier momento sin dar una razón, y no afectará su atención médica estándar de ninguna manera.' },
                    fr: { q: 'Puis-je quitter l\'étude à tout moment ?', a: 'Oui, absolument. La participation est entièrement volontaire. Vous pouvez vous retirer de l\'étude à tout moment sans donner de raison, et cela n\'affectera en aucune façon vos soins médicaux habituels.' }
                },
                'Will I need to pay for the treatment?': {
                    es: { q: '¿Tendré que pagar por el tratamiento?', a: 'No, el tratamiento del estudio, las pruebas relacionadas y las visitas a la clínica se proporcionan sin costo alguno para usted. También se le pueden reembolsar los gastos de viaje razonables para asistir a las visitas del estudio.' },
                    fr: { q: 'Devrai-je payer pour le traitement ?', a: 'Non, le traitement de l\'étude, les tests connexes et les visites à la clinique vous sont fournis sans frais. Vous pouvez également être remboursé pour les frais de déplacement raisonnables pour assister aux visites de l\'étude.' }
                },
                'What is the CardioBridge device?': {
                    es: { q: '¿Qué es el dispositivo CardioBridge?', a: 'El CardioBridge es un pequeño dispositivo implantable destinado a controlar continuamente la presión arterial de la arteria pulmonar, lo que permite un manejo más preciso de la medicación para la insuficiencia cardíaca de forma remota.' },
                    fr: { q: 'Qu\'est-ce que le dispositif CardioBridge ?', a: 'Le CardioBridge est un petit dispositif implantable destiné à surveiller en continu la pression de l\'artère pulmonaire, permettant une gestion plus précise des médicaments contre l\'insuffisance cardiaque à distance.' }
                },
                'How is the device implanted?': {
                    es: { q: '¿Cómo se implanta el dispositivo?', a: 'El dispositivo se implanta durante un procedimiento mínimamente invasivo utilizando un catéter insertado a través de una vena de la ingle, guiado hasta el corazón. Por lo general, requiere anestesia local.' },
                    fr: { q: 'Comment le dispositif est-il implanté ?', a: 'Le dispositif est implanté lors d\'une procédure peu invasive à l\'aide d\'un cathéter inséré par une veine de l\'aine, guidé jusqu\'au cœur. Cela nécessite généralement une anesthésie locale.' }
                },
                'Will I still need to take my heart failure medication?': {
                    es: { q: '¿Todavía tendré que tomar mi medicamento para la insuficiencia cardíaca?', a: 'Sí, continuará tomando medicamentos, pero su médico puede ajustar las dosis de manera más rápida y precisa en función de las lecturas diarias procedentes del dispositivo CardioBridge.' },
                    fr: { q: 'Devrai-je toujours prendre mes médicaments contre l\'insuffisance cardiaque ?', a: 'Oui, vous continuerez à prendre des médicaments, mais votre médecin pourra ajuster les doses plus rapidement et plus précisément en fonction des lectures quotidiennes du dispositif CardioBridge.' }
                },
                'Is there a risk of device failure?': {
                    es: { q: '¿Existe riesgo de falla del dispositivo?', a: 'Como con cualquier dispositivo médico, existe un riesgo muy pequeño de mal funcionamiento. Durante el ensayo, será supervisado de cerca y las inspecciones regulares del dispositivo son parte de las visitas programadas al estudio.' },
                    fr: { q: 'Y a-t-il un risque de défaillance du dispositif ?', a: 'Comme pour tout dispositif médical, il existe un très faible risque de dysfonctionnement. Pendant l\'essai, vous serez surveillé de près et des inspections régulières du dispositif font partie des visites prévues de l\'étude.' }
                },
                'How often does the device send data?': {
                    es: { q: '¿Con qué frecuencia envía datos el dispositivo?', a: 'A los pacientes se les pedirá que tomen una lectura diaria usando una pequeña almohadilla externa proporcionada, que transmite datos de forma inalámbrica y segura al equipo de investigación y a su cardiólogo.' },
                    fr: { q: 'À quelle fréquence le dispositif envoie-t-il des données ?', a: 'Il sera demandé aux patients de prendre une lecture quotidienne à l\'aide d\'un petit coussin externe fourni, qui transmet les données sans fil et en toute sécurité à l\'équipe de recherche et à votre cardiologue.' }
                }
            };

            const trans = translations[faq.question] || { es: { q: faq.question, a: faq.answer }, fr: { q: faq.question, a: faq.answer } };
            return {
                question: { en: faq.question, es: trans.es.q, fr: trans.fr.q },
                answer: { en: faq.answer, es: trans.es.a, fr: trans.fr.a }
            };
        });

        // Search FAQs
        const matchingFaq = translatedFaqs.find(
            (faq) =>
                faq.question[lang].toLowerCase().includes(lowerMsg) ||
                lowerMsg.includes(faq.question[lang].toLowerCase().split(' ').slice(0, 3).join(' ')) ||
                faq.answer[lang].toLowerCase().includes(lowerMsg)
        );

        if (matchingFaq) {
            response = matchingFaq.answer[lang];
        } else {
            // Document summaries mock translation
            const isOnco = patient.projectId === 'proj-onco-001';
            const translatedSummaries = {
                en: typeof patient.project.summary?.sections === 'string'
                    ? JSON.parse(patient.project.summary.sections)
                    : patient.project.summary?.sections || {},
                es: isOnco ? {
                    why: 'Estamos investigando un nuevo tratamiento llamado OV-201 para un tipo de cáncer de pulmón conocido como cáncer de pulmón de células no pequeñas (CPCNP).',
                    what: 'Si acepta participar, recibirá OV-201 como infusión intravenosa una vez cada tres semanas en nuestra clínica.',
                    risks: 'Como todos los tratamientos médicos, OV-201 puede causar efectos secundarios. Los efectos más comúnmente reportados incluyen fatiga, náuseas leves y cambios temporales.',
                    timeline: 'El estudio dura aproximadamente 9 meses. Después de una visita de selección inicial, asistirá a la clínica cada 3 semanas.',
                    next: 'Si está interesado en participar, el siguiente paso es hablar con un miembro de nuestro equipo de investigación.'
                } : {
                    why: 'CardioBridge está siendo evaluado para pacientes con insuficiencia cardíaca avanzada.',
                    what: 'El procedimiento implica la implantación del sensor a través de un procedimiento mínimamente invasivo.',
                    risks: 'Los riesgos están principalmente relacionados con el procedimiento de implantación, como sangrado leve o infección.',
                    timeline: 'La participación en el estudio dura 12 meses, con seguimiento telefónico de rutina.',
                    next: 'Si decide participar, programaremos una evaluación inicial.'
                },
                fr: isOnco ? {
                    why: 'Nous recherchons un nouveau traitement appelé OV-201 pour un type de cancer du poumon connu sous le nom de cancer du poumon non à petites cellules (CPNPC).',
                    what: 'Si vous acceptez de participer, vous recevrez l\'OV-201 sous forme de perfusion intraveineuse une fois toutes les trois semaines dans notre clinique.',
                    risks: 'Comme tous les traitements médicaux, l\'OV-201 peut provoquer des effets secondaires. Les effets les plus fréquemment rapportés comprennent la fatigue, de légères nausées et des changements temporaires.',
                    timeline: 'L\'étude dure environ 9 mois. Après une visite de sélection initiale, vous vous rendrez à la clinique toutes les 3 semaines.',
                    next: 'Si vous souhaitez participer, l\'étape suivante consiste à parler avec un membre de notre équipe de recherche.'
                } : {
                    why: 'CardioBridge est en cours d\'évaluation pour les patients atteints d\'insuffisance cardiaque avancée.',
                    what: 'La procédure implique l\'implantation du capteur par une procédure peu invasive.',
                    risks: 'Les risques sont principalement liés à la procédure d\'implantation, tels qu\'un léger saignement ou une infection.',
                    timeline: 'La participation à l\'étude dure 12 mois, avec un suivi téléphonique de routine.',
                    next: 'Si vous décidez de participer, nous programmerons une évaluation initiale.'
                }
            };

            const summaryObj = translatedSummaries[lang] || translatedSummaries.en;

            const localizedConfig = {
                en: {
                    labels: { why: 'Why this trial', what: 'What participation involves', risks: 'Risks and benefits', timeline: 'Timeline and visits', next: 'What happens next' },
                    prefix: 'Based on the "{label}" section of the study information:\n\n',
                    notFound: "I'm sorry, I couldn't find a specific answer to that question in the study materials. I'd recommend reviewing the summary sections above, or you can contact the clinical team directly for more detailed information.",
                    keywords: { 'risk': 'risks', 'side effect': 'risks', 'danger': 'risks', 'safe': 'risks', 'how long': 'timeline', 'visit': 'timeline', 'duration': 'timeline', 'schedule': 'timeline', 'why': 'why', 'purpose': 'why', 'reason': 'why', 'what': 'what', 'involve': 'what', 'do i': 'what', 'next': 'next', 'step': 'next', 'after': 'next' }
                },
                es: {
                    labels: { why: 'Por qué este ensayo', what: 'Qué implica la participación', risks: 'Riesgos y beneficios', timeline: 'Cronograma y visitas', next: 'Qué pasa después' },
                    prefix: 'Según la sección "{label}" de la información del estudio:\n\n',
                    notFound: "Lo siento, no pude encontrar una respuesta específica a esa pregunta en los materiales del estudio. Recomendaría revisar las secciones de resumen anteriores, o puede comunicarse directamente con el equipo clínico para obtener información más detallada.",
                    keywords: { 'riesgo': 'risks', 'efecto secundario': 'risks', 'peligro': 'risks', 'seguro': 'risks', 'cuánto tiempo': 'timeline', 'visita': 'timeline', 'duración': 'timeline', 'horario': 'timeline', 'por qué': 'why', 'propósito': 'why', 'razón': 'why', 'qué': 'what', 'implica': 'what', 'tengo que': 'what', 'siguiente': 'next', 'paso': 'next', 'después': 'next' }
                },
                fr: {
                    labels: { why: 'Pourquoi cet essai', what: "Ce qu'implique la participation", risks: 'Risques et avantages', timeline: 'Calendrier et visites', next: 'Et après' },
                    prefix: 'D\'après la section "{label}" des informations sur l\'étude :\n\n',
                    notFound: "Je suis désolé, je n'ai pas pu trouver de réponse spécifique à cette question dans les documents de l'étude. Je vous recommande de consulter les sections de résumé ci-dessus, ou vous pouvez contacter directement l'équipe clinique pour des informations plus détaillées.",
                    keywords: { 'risque': 'risks', 'effet secondaire': 'risks', 'danger': 'risks', 'sûr': 'risks', 'combien de temps': 'timeline', 'visite': 'timeline', 'durée': 'timeline', 'calendrier': 'timeline', 'pourquoi': 'why', 'but': 'why', 'raison': 'why', 'quoi': 'what', 'implique': 'what', 'dois-je': 'what', 'prochain': 'next', 'étape': 'next', 'après': 'next' }
                }
            };

            const config = localizedConfig[lang] || localizedConfig.en;

            let matchedSection = null;
            for (const [key, content] of Object.entries(summaryObj)) {
                const label = config.labels[key] || key;
                if (content && (content.toLowerCase().includes(lowerMsg) || lowerMsg.includes(label.toLowerCase()))) {
                    matchedSection = { key, label, content };
                    break;
                }
            }

            // Keyword-based matching for common questions
            if (!matchedSection) {
                for (const [keyword, sectionKey] of Object.entries(config.keywords)) {
                    if (lowerMsg.includes(keyword) && summaryObj[sectionKey]) {
                        matchedSection = { key: sectionKey, label: config.labels[sectionKey], content: summaryObj[sectionKey] };
                        break;
                    }
                }
            }

            if (matchedSection) {
                response = config.prefix.replace('{label}', matchedSection.label) + matchedSection.content;
            } else {
                response = config.notFound;
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
