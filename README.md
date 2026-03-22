# Trial Lens

**Make trial information easy to understand**

Trial Lens turns long Participant Information (PI) documents into a patient-friendly digital journey with video, summaries, FAQs, and a trial-trained assistant.

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed demo data
node prisma/seed.mjs

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@triallens.io | admin123 |
| Staff | staff@triallens.io | staff123 |

## Demo Patient Pages

- OncoVision patient: [http://localhost:3000/p/demo-token-onco-emily](http://localhost:3000/p/demo-token-onco-emily)
- CardioBridge patient: [http://localhost:3000/p/demo-token-cardio-david](http://localhost:3000/p/demo-token-cardio-david)

## Adding Your Logo and Videos

### Logo
Place your logo image at:
```
public/logo.png
```
The logo component renders brand text ("Trial" in navy + "Lens" in teal) to match the uploaded logo style.

### Videos
Place your two demo videos at:
```
public/demo/video1.mp4   → OncoVision Phase II
public/demo/video2.mp4   → CardioBridge Study
```

## Project Structure

```
src/
├── app/
│   ├── page.jsx                          # Landing page
│   ├── layout.jsx                        # Root layout
│   ├── globals.css                       # Design system
│   ├── auth/sign-in/page.jsx              # Sign-in page
│   ├── dashboard/
│   │   ├── layout.jsx                    # Dashboard sidebar
│   │   ├── page.jsx                      # Projects list
│   │   └── projects/
│   │       ├── new/page.jsx              # Create project
│   │       └── [projectId]/
│   │           ├── page.jsx              # Project detail (5 tabs)
│   │           └── preview/page.jsx      # Patient preview
│   ├── p/[token]/page.jsx                # Patient experience
│   └── api/                              # API routes
│       ├── auth/[...nextauth]/           # Authentication
│       ├── projects/                     # Project CRUD
│       ├── patient/[token]/              # Patient data, chat, consent, escalation
│       └── uploads/                      # File serving
├── components/Logo.jsx                   # Branding component
├── lib/
│   ├── prisma.js                         # Prisma singleton
│   └── audit.js                          # Audit logging helper
└── middleware.js                          # Auth & robot tags
```

## Features

- **Public marketing site** with hero, problem, stats, how-it-works, features
- **Researcher portal** with project management, document upload, FAQ editor, patient management
- **Patient experience** with video, summaries, FAQs, chat assistant, consent capture
- **Authentication** with NextAuth.js (Credentials provider, JWT sessions)
- **Database** with Prisma ORM + SQLite (11 models)
- **Audit trail** for document uploads, invites, consents, escalations
- **Rate limiting** on chat endpoint

## Coming Soon Placeholders

- 🤖 AI video generation from documents
- 🤖 AI chatbot grounded in trial materials
- Auto-generated FAQs from uploaded documents

## Tech Stack

- **Next.js 14** (App Router)
- **Prisma** + SQLite
- **NextAuth.js** (Credentials, JWT)
- **Vanilla CSS** (design system with custom properties)

## Extending for Production

- **Cloud storage**: Replace local `uploads/` with S3/GCS by modifying the document and video upload routes
- **AI chatbot**: Implement in `src/app/api/patient/[token]/chat/route.js` — the stub architecture is ready for LLM integration
- **AI video**: Add generation logic where the "Coming soon" placeholder appears in the Video & Summaries tab
- **Database**: Change `prisma/schema.prisma` datasource from `sqlite` to `postgresql` and update `DATABASE_URL`
