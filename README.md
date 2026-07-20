# Mocki AI

A free, voice-based AI mock interview practice tool. Upload your CV, pick a role and experience level, answer AI-generated interview questions out loud, and get an instant AI-scored feedback report, saved to your history for later.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Features

- CV upload (PDF/DOCX) with AI-powered profile extraction
- AI-generated interview questions tailored to your CV, role, and experience level
- Voice-based interview sessions with live speech-to-text and webcam recording
- AI-scored feedback report (technical, communication, confidence) with per-question breakdown
- Interview history with saved reports and PDF export
- Clerk-based authentication

---

## Requirements

- Node.js **v18 or later**
- npm

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL=                                   # MongoDB connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
GEMINI_API_KEY=                                 # Google Generative AI key
```

---

## Installation

```bash
npm install
npx prisma generate
```

---

## Run the Development Server

```bash
npm run dev
```

---

## Create a Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── (site)/       # Public pages + dashboard (the actual product)
│   │   └── dashboard/ # CV upload, interview setup, interview room, history
│   └── api/           # CV parsing/extraction, interview generation & scoring
├── components/        # UI and layout components
├── lib/
│   ├── gemini.ts       # Shared Gemini AI client
│   └── cv/             # CV parsing, question generation, interview scoring
└── middleware.ts       # Clerk auth route protection

prisma/
└── schema.prisma       # User / Interview / Report data model
```

For a deeper walkthrough of how the product works end-to-end, see `PROJECT_DOCUMENTATION.md`.

---

## Deployment

Deployed on Vercel. The build command is `npm run build`, output directory `.next`.
