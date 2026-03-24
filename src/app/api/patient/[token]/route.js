import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
                question: {
                    en: 'What type of cancer is OV-201 being tested for?',
                    es: '¿Para qué tipo de cáncer se está probando OV-201?',
                    fr: 'Pour quel type de cancer OV-201 est-il testé ?'
                },
                options: {
                    en: ['Breast cancer', 'Non-small cell lung cancer (NSCLC)', 'Colon cancer', 'Skin cancer'],
                    es: ['Cáncer de mama', 'Cáncer de pulmón de células no pequeñas (CPCNP)', 'Cáncer de colon', 'Cáncer de piel'],
                    fr: ['Cancer du sein', 'Cancer du poumon non à petites cellules (CPNPC)', 'Cancer du côlon', 'Cancer de la peau']
                },
                correctIndex: 1,
            },
            {
                id: 'q2',
                question: {
                    en: 'How often will you receive the OV-201 treatment?',
                    es: '¿Con qué frecuencia recibirá el tratamiento OV-201?',
                    fr: 'À quelle fréquence recevrez-vous le traitement OV-201 ?'
                },
                options: {
                    en: ['Every day', 'Once a week', 'Every three weeks', 'Once a month'],
                    es: ['Todos los días', 'Una vez a la semana', 'Cada tres semanas', 'Una vez al mes'],
                    fr: ['Tous les jours', 'Une fois par semaine', 'Toutes les trois semaines', 'Une fois par mois']
                },
                correctIndex: 2,
            },
            {
                id: 'q3',
                question: {
                    en: 'Approximately how long does the study last?',
                    es: '¿Aproximadamente cuánto dura el estudio?',
                    fr: 'Combien de temps dure l\'étude environ ?'
                },
                options: {
                    en: ['3 months', '6 months', '9 months', '2 years'],
                    es: ['3 meses', '6 meses', '9 meses', '2 años'],
                    fr: ['3 mois', '6 mois', '9 mois', '2 ans']
                },
                correctIndex: 2,
            },
            {
                id: 'q4',
                question: {
                    en: 'Can you withdraw from the study at any time?',
                    es: '¿Puede retirarse del estudio en cualquier momento?',
                    fr: 'Pouvez-vous vous retirer de l\'étude à tout moment ?'
                },
                options: {
                    en: [
                        'No, once enrolled you must complete the study',
                        'Only with your doctor\'s permission',
                        'Yes, at any time without giving a reason',
                        'Only within the first month',
                    ],
                    es: [
                        'No, una vez inscrito debe completar el estudio',
                        'Solo con el permiso de su médico',
                        'Sí, en cualquier momento sin dar una razón',
                        'Solo dentro del primer mes',
                    ],
                    fr: [
                        'Non, une fois inscrit vous devez terminer l\'étude',
                        'Seulement avec la permission de votre médecin',
                        'Oui, à tout moment sans donner de raison',
                        'Seulement pendant le premier mois',
                    ]
                },
                correctIndex: 2,
            },
            {
                id: 'q5',
                question: {
                    en: 'Will you need to pay for the study treatment?',
                    es: '¿Tendrá que pagar por el tratamiento del estudio?',
                    fr: 'Devrez-vous payer pour le traitement de l\'étude ?'
                },
                options: {
                    en: ['Yes, at a subsidised rate', 'Yes, full price', 'No, the treatment and tests are free', 'Only for the medication'],
                    es: ['Sí, a una tarifa subsidiada', 'Sí, precio completo', 'No, el tratamiento y las pruebas son gratuitos', 'Solo por los medicamentos'],
                    fr: ['Oui, à un tarif subventionné', 'Oui, plein tarif', 'Non, le traitement et les tests sont gratuits', 'Seulement pour les médicaments']
                },
                correctIndex: 2,
            },
        ] : [
            {
                id: 'q1',
                question: {
                    en: 'What condition is the CardioBridge device designed to help with?',
                    es: '¿Para qué afección está diseñado el dispositivo CardioBridge?',
                    fr: 'Pour quelle maladie le dispositif CardioBridge est-il conçu ?'
                },
                options: {
                    en: ['Lung disease', 'Chronic heart failure', 'Diabetes', 'High blood pressure'],
                    es: ['Enfermedad pulmonar', 'Insuficiencia cardíaca crónica', 'Diabetes', 'Presión arterial alta'],
                    fr: ['Maladie pulmonaire', 'Insuffisance cardiaque chronique', 'Diabète', 'Hypertension artérielle']
                },
                correctIndex: 1,
            },
            {
                id: 'q2',
                question: {
                    en: 'How is the CardioBridge device placed?',
                    es: '¿Cómo se coloca el dispositivo CardioBridge?',
                    fr: 'Comment le dispositif CardioBridge est-il placé ?'
                },
                options: {
                    en: ['Open-heart surgery', 'Minimally invasive catheter procedure', 'External attachment to the chest', 'Oral medication'],
                    es: ['Cirugía a corazón abierto', 'Procedimiento de catéter mínimamente invasivo', 'Fijación externa al pecho', 'Medicamentos orales'],
                    fr: ['Chirurgie à cœur ouvert', 'Intervention par cathéter peu invasive', 'Fixation externe sur la poitrine', 'Médicament oral']
                },
                correctIndex: 1,
            },
            {
                id: 'q3',
                question: {
                    en: 'How long does the device placement procedure typically take?',
                    es: '¿Cuánto tiempo dura típicamente el procedimiento de colocación del dispositivo?',
                    fr: 'Combien de temps dure généralement l\'intervention de pose du dispositif ?'
                },
                options: {
                    en: ['15 minutes', '1–2 hours', '4–6 hours', 'A full day'],
                    es: ['15 minutos', '1–2 horas', '4–6 horas', 'Un día completo'],
                    fr: ['15 minutes', '1 à 2 heures', '4 à 6 heures', 'Une journée complète']
                },
                correctIndex: 1,
            },
            {
                id: 'q4',
                question: {
                    en: 'How long is the total study follow-up period?',
                    es: '¿Cuánto dura el período de seguimiento total del estudio?',
                    fr: 'Quelle est la durée totale de la période de suivi de l\'étude ?'
                },
                options: {
                    en: ['3 months', '6 months', '12 months', '24 months'],
                    es: ['3 meses', '6 meses', '12 meses', '24 meses'],
                    fr: ['3 mois', '6 mois', '12 mois', '24 mois']
                },
                correctIndex: 2,
            },
            {
                id: 'q5',
                question: {
                    en: 'Will the CardioBridge device replace your current heart failure medications?',
                    es: '¿Se reemplazarán sus medicamentos actuales para la insuficiencia cardíaca por el dispositivo CardioBridge?',
                    fr: 'Le dispositif CardioBridge remplacera-t-il vos médicaments actuels pour l\'insuffisance cardiaque ?'
                },
                options: {
                    en: ['Yes, completely', 'Yes, partially', 'No, it works alongside existing medications', 'Only some medications will be stopped'],
                    es: ['Sí, completamente', 'Sí, parcialmente', 'No, funciona junto con los medicamentos existentes', 'Solo algunos medicamentos se suspenderán'],
                    fr: ['Oui, complètement', 'Oui, en partie', 'Non, il fonctionne en complément des médicaments existants', 'Seuls certains médicaments seront arrêtés']
                },
                correctIndex: 2,
            },
        ];

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
                id: faq.id,
                projectId: faq.projectId,
                question: {
                    en: faq.question,
                    es: trans.es.q,
                    fr: trans.fr.q
                },
                answer: {
                    en: faq.answer,
                    es: trans.es.a,
                    fr: trans.fr.a
                },
                orderIndex: faq.orderIndex
            };
        });

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
            faqs: translatedFaqs,
            documents: patient.project.documents,
        });
    } catch (error) {
        console.error('Patient page error:', error);
        return NextResponse.json({ error: 'Failed to load page' }, { status: 500 });
    }
}
