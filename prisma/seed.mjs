import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Trial Lens database...');

    // --- Users ---
    const adminPass = await bcrypt.hash('admin123', 10);
    const staffPass = await bcrypt.hash('staff123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@triallens.io' },
        update: {},
        create: {
            id: 'user-admin-001',
            email: 'admin@triallens.io',
            passwordHash: adminPass,
            name: 'Dr. Sarah Mitchell',
            role: 'RESEARCHER_ADMIN',
        },
    });

    const staff = await prisma.user.upsert({
        where: { email: 'staff@triallens.io' },
        update: {},
        create: {
            id: 'user-staff-001',
            email: 'staff@triallens.io',
            passwordHash: staffPass,
            name: 'James Henderson',
            role: 'RESEARCHER_STAFF',
        },
    });

    console.log('  ✓ Users created');

    // --- Project 1: OncoVision Phase II ---
    const project1 = await prisma.project.upsert({
        where: { id: 'proj-onco-001' },
        update: {},
        create: {
            id: 'proj-onco-001',
            name: 'OncoVision Phase II',
            therapeuticArea: 'Oncology',
            trialPhase: 'Phase II',
            sponsor: 'OncoVision Therapeutics Ltd',
            description: 'A Phase II clinical trial evaluating the efficacy and safety of OV-201, a novel targeted therapy for advanced non-small cell lung cancer (NSCLC) in patients who have progressed on prior immunotherapy.',
            languages: 'English',
            status: 'ACTIVE',
            createdById: admin.id,
        },
    });

    // --- Project 2: CardioBridge Study ---
    const project2 = await prisma.project.upsert({
        where: { id: 'proj-cardio-001' },
        update: {},
        create: {
            id: 'proj-cardio-001',
            name: 'CardioBridge Study',
            therapeuticArea: 'Cardiology',
            trialPhase: 'Phase III',
            sponsor: 'CardioBridge Medical Research',
            description: 'A Phase III multi-centre trial investigating a novel minimally invasive cardiac device for patients with chronic heart failure who are not candidates for conventional surgery.',
            languages: 'English,Spanish',
            status: 'ACTIVE',
            createdById: admin.id,
        },
    });

    console.log('  ✓ Projects created');

    // --- Videos ---
    await prisma.video.upsert({
        where: { id: 'video-onco-001' },
        update: {},
        create: {
            id: 'video-onco-001',
            projectId: project1.id,
            sourceType: 'UPLOADED',
            filepath: '/demo/video1.mp4',
            title: 'OncoVision Phase II — What You Need to Know',
        },
    });

    await prisma.video.upsert({
        where: { id: 'video-cardio-001' },
        update: {},
        create: {
            id: 'video-cardio-001',
            projectId: project2.id,
            sourceType: 'UPLOADED',
            filepath: '/demo/video2.mp4',
            title: 'CardioBridge Study — Your Guide to Participating',
        },
    });

    console.log('  ✓ Videos created');

    // --- Summaries ---
    const oncoSummary = {
        why: 'We are researching a new treatment called OV-201 for a type of lung cancer known as non-small cell lung cancer (NSCLC). This trial aims to find out whether OV-201 can help people whose cancer has continued to grow despite previous treatment with immunotherapy. Your participation may help us understand whether this new approach could become a future treatment option.',
        what: 'If you agree to take part, you will receive OV-201 as an intravenous infusion once every three weeks at our clinic. You will have regular check-ups, blood tests, and imaging scans to monitor how the treatment is working and to ensure your safety. The study involves approximately 12 visits to the clinic over a 9-month period.',
        risks: 'Like all medical treatments, OV-201 may cause side effects. The most commonly reported effects in earlier studies include fatigue, mild nausea, and temporary changes in blood counts. Less common but more serious effects could include allergic reactions. Our medical team will monitor you closely throughout the study and will explain all known risks in detail before you decide.',
        timeline: 'The study lasts approximately 9 months. After an initial screening visit, you will attend the clinic every 3 weeks for treatment. Follow-up visits will continue for 3 months after your last dose. In total, you can expect about 12–15 clinic visits.',
        next: 'If you are interested in participating, the next step is to speak with a member of our research team. They will answer any questions you may have, review your medical history, and determine whether this trial is suitable for you. There is no obligation to participate, and you can withdraw at any time.',
    };

    const cardioSummary = {
        why: 'We are testing a new medical device called the CardioBridge System for people living with chronic heart failure. This device is designed to support the heart in a less invasive way than traditional surgery. We want to find out if this device is safe and whether it can improve quality of life for patients who are not suitable candidates for major heart surgery.',
        what: 'Participation involves a minimally invasive procedure to place the CardioBridge device, followed by regular monitoring appointments. You will be asked to attend clinic visits at 1 week, 1 month, 3 months, 6 months, and 12 months after the procedure. At each visit, we will check how the device is working and assess your overall health.',
        risks: 'As with any medical procedure, there are risks. These include the risks associated with the device placement procedure (such as bleeding or infection) and the possibility that the device may not provide the expected benefit. There are also standard risks associated with anaesthesia. All risks will be thoroughly discussed with you by the medical team.',
        timeline: 'The study period is 12 months from the date of your procedure. You will have a screening visit, the device placement procedure (typically 1–2 hours), and then follow-up visits at 1 week, 1 month, 3 months, 6 months, and 12 months.',
        next: 'If you would like to learn more, please contact our research coordinator. They will arrange a screening appointment to assess whether the study is right for you. Remember, participation is entirely voluntary and you may change your mind at any point.',
    };

    await prisma.summary.upsert({
        where: { projectId: project1.id },
        update: {},
        create: { projectId: project1.id, sections: JSON.stringify(oncoSummary) },
    });

    await prisma.summary.upsert({
        where: { projectId: project2.id },
        update: {},
        create: { projectId: project2.id, sections: JSON.stringify(cardioSummary) },
    });

    console.log('  ✓ Summaries created');

    // --- FAQs for Project 1 ---
    const oncoFaqs = [
        { q: 'What is OV-201?', a: 'OV-201 is a novel targeted therapy designed to block specific molecular pathways that help cancer cells grow. It is being developed as a potential treatment for advanced non-small cell lung cancer.' },
        { q: 'Am I eligible to participate?', a: 'You may be eligible if you are aged 18 or over, have been diagnosed with advanced NSCLC, and have previously received immunotherapy treatment. The research team will conduct a screening assessment to confirm your eligibility.' },
        { q: 'Will I definitely receive the treatment?', a: 'In this trial, all participants will receive OV-201. There is no placebo group. However, as with any investigational treatment, we cannot guarantee it will be beneficial for you personally.' },
        { q: 'What happens if I experience side effects?', a: 'Our medical team will monitor you closely throughout the study. If you experience any side effects, they will be managed according to established medical protocols. You can contact the study team at any time if you have concerns.' },
        { q: 'Can I leave the study at any time?', a: 'Yes, absolutely. Participation is entirely voluntary. You can withdraw from the study at any point without giving a reason, and it will not affect your standard medical care in any way.' },
        { q: 'Will I need to pay for the treatment?', a: 'No, the study treatment, related tests, and clinic visits are provided at no cost to you. You may also be reimbursed for reasonable travel expenses to attend study visits.' },
    ];

    for (let i = 0; i < oncoFaqs.length; i++) {
        await prisma.fAQ.create({
            data: {
                projectId: project1.id,
                question: oncoFaqs[i].q,
                answer: oncoFaqs[i].a,
                orderIndex: i,
            },
        });
    }

    // --- FAQs for Project 2 ---
    const cardioFaqs = [
        { q: 'What is the CardioBridge device?', a: 'The CardioBridge System is a small, minimally invasive cardiac support device designed to help the heart pump blood more efficiently in patients with chronic heart failure.' },
        { q: 'How is the device placed?', a: 'The device is placed through a minimally invasive procedure, typically using a catheter inserted through a small incision. The procedure usually takes 1–2 hours and is performed under anaesthesia.' },
        { q: 'Who can participate in this study?', a: 'Adults aged 18 or over with a diagnosis of chronic heart failure (NYHA Class III or IV) who are not suitable candidates for conventional heart surgery may be eligible. A screening assessment will confirm eligibility.' },
        { q: 'What are the risks of the procedure?', a: 'Risks include those associated with any minimally invasive cardiac procedure, such as bleeding, infection, or device-related complications. The medical team will discuss all risks with you before obtaining your consent.' },
        { q: 'How long does the study last?', a: 'The study period is 12 months from device placement. You will attend follow-up visits at 1 week, 1 month, 3 months, 6 months, and 12 months after the procedure.' },
        { q: 'Will this replace my current heart failure medication?', a: 'No, the CardioBridge device is designed to work alongside your existing medications. Your current treatment plan will continue, and any changes will be made only by your medical team based on your clinical needs.' },
    ];

    for (let i = 0; i < cardioFaqs.length; i++) {
        await prisma.fAQ.create({
            data: {
                projectId: project2.id,
                question: cardioFaqs[i].q,
                answer: cardioFaqs[i].a,
                orderIndex: i,
            },
        });
    }

    console.log('  ✓ FAQs created');

    // --- Patients ---
    const patient1 = await prisma.patient.create({
        data: {
            id: 'patient-001',
            projectId: project1.id,
            patientDisplayId: 'PT-E7K2M9',
            firstName: 'Emily',
            lastName: 'Thompson',
            email: 'emily.thompson@example.com',
            phone: '+44 7700 900123',
            privacyMode: 'NON_ANONYMOUS',
            outreachMethod: 'DIRECT_OUTREACH',
            inviteToken: 'demo-token-onco-emily',
            inviteStatus: 'SENT',
            consentStatus: 'NOT_STARTED',
        },
    });

    const patient2 = await prisma.patient.create({
        data: {
            id: 'patient-002',
            projectId: project2.id,
            patientDisplayId: 'PT-D4R1N6',
            firstName: 'David',
            lastName: 'Chen',
            email: 'david.chen@example.com',
            phone: '+44 7700 900456',
            privacyMode: 'NON_ANONYMOUS',
            outreachMethod: 'NHS_DIGITRIALS',
            inviteToken: 'demo-token-cardio-david',
            inviteStatus: 'SENT',
            consentStatus: 'NOT_STARTED',
        },
    });

    const patient3 = await prisma.patient.create({
        data: {
            id: 'patient-003',
            projectId: project1.id,
            patientDisplayId: 'PT-X9W3B5',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            privacyMode: 'ANONYMOUS',
            outreachMethod: 'NHS_DIGITRIALS',
            inviteToken: 'demo-token-onco-anon',
            inviteStatus: 'SENT',
            consentStatus: 'NOT_STARTED',
        },
    });

    console.log('  ✓ Patients created');

    // --- Audit logs for seeded data ---
    await prisma.auditLog.createMany({
        data: [
            {
                action: 'PROJECT_CREATED',
                entityType: 'Project',
                entityId: project1.id,
                userId: admin.id,
                projectId: project1.id,
                details: 'Seeded project: OncoVision Phase II',
            },
            {
                action: 'PROJECT_CREATED',
                entityType: 'Project',
                entityId: project2.id,
                userId: admin.id,
                projectId: project2.id,
                details: 'Seeded project: CardioBridge Study',
            },
            {
                action: 'PATIENT_INVITE',
                entityType: 'Patient',
                entityId: patient1.id,
                userId: admin.id,
                projectId: project1.id,
                patientId: patient1.id,
                details: 'Demo patient invite created: Emily Thompson',
            },
            {
                action: 'PATIENT_INVITE',
                entityType: 'Patient',
                entityId: patient2.id,
                userId: admin.id,
                projectId: project2.id,
                patientId: patient2.id,
                details: 'Demo patient invite created: David Chen',
            },
            {
                action: 'PATIENT_INVITE',
                entityType: 'Patient',
                entityId: patient3.id,
                userId: admin.id,
                projectId: project1.id,
                patientId: patient3.id,
                details: 'Demo anonymous patient invite created: PT-X9W3B5',
            },
        ],
    });

    console.log('  ✓ Audit logs created');
    console.log('');
    console.log('🎉 Seeding complete!');
    console.log('');
    console.log('Demo credentials:');
    console.log('  Admin: admin@triallens.io / admin123');
    console.log('  Staff: staff@triallens.io / staff123');
    console.log('');
    console.log('Patient pages:');
    console.log('  http://localhost:3000/p/demo-token-onco-emily');
    console.log('  http://localhost:3000/p/demo-token-cardio-david');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
