# Mocki AI — Project Documentation

> A free, voice-based AI mock interview practice platform. Users speak their answers out loud to real interview questions, get AI-generated feedback, and track their progress over time.

This document explains what the product is, how it works from a user's perspective, and how the system is built — written to be understandable without a technical background.

---

## 1. What This Project Is

Mocki AI helps someone practice for a real job interview by simulating one. Instead of reading generic tips, the user:

1. Uploads their CV.
2. Chooses the type of role and experience level they're interviewing for.
3. Answers 9 interview questions **out loud**, using their camera and microphone — just like a real interview call.
4. Receives an AI-generated performance report immediately after: an overall score, a breakdown by category, specific strengths and areas to improve, and feedback on every individual answer.
5. Can revisit any past interview and its report at any time, and download it as a PDF.

It's a **free, personal project** — not a paid product, and not a company. There's no team, no subscription, no sales pitch. The website's tone and copy are written to reflect that honestly.

---

## 2. How It Works — Step by Step (User Journey)

This is the actual path a user takes through the product, start to finish.

### Step 1 — Sign in
The user creates an account or signs in (handled by a third-party authentication service called Clerk — the same kind of "Sign in with email/Google" flow used by most modern apps). Once signed in, they land on their personal Dashboard.

### Step 2 — Upload a CV
On the Dashboard, the user uploads their CV as a PDF or Word document. Behind the scenes, the system reads the file's text and uses AI to pull out the useful details automatically: name, skills, years of experience, education, current role, and industry. The user sees this extracted profile and can review or correct anything before moving on.

### Step 3 — Set up the interview
The user picks:
- **Industry / role** — pre-filled from their CV, editable if needed (e.g. "Frontend Developer", "Product Manager").
- **Experience level** — Fresher, Junior, Mid-level, Senior, Lead, or Manager (also pre-filled based on their years of experience).

They then click **Start Interview**, and the browser asks for camera and microphone permission (with clear, friendly error messages if that's blocked, missing, or in use by another app).

### Step 4 — The interview itself
The system generates **9 interview questions** tailored to the user's profile and chosen role — a mix of easier and harder questions, covering behavioral and role-specific topics.

The user then enters the "Interview Room" — a focused, full-screen recording view:
- One question shown at a time, with a 60-second timer.
- The user clicks **Record Answer** and speaks their response out loud; their voice is transcribed live on screen as they talk (so they can see what's being captured).
- They can **Submit & Next** to move on, or **Skip** a question they don't want to answer.
- This repeats for all 9 questions.

### Step 5 — Instant feedback report
As soon as the last question is answered, the system sends everything to the AI for scoring, and the user sees their report right away. It includes:
- An **overall score** out of 100.
- Sub-scores for **Technical knowledge**, **Communication**, and **Confidence**.
- A short list of **strengths** and **areas to improve**.
- A written **summary** and a **recommendation** (e.g. whether they seem ready, or what to work on).
- **Per-question feedback** — how relevant, clear, and confident each specific answer was.

The user can **download this report as a PDF** to keep or share.

### Step 6 — History, always available
Every completed interview and its report is automatically saved. The user can go to their **History** page at any time to see a table of every past attempt (role, date, score, and a quick "how ready are you" indicator), click into any of them to see the full report again, and download it as a PDF whenever they like. This lets them track improvement over multiple practice sessions.

---

## 3. Tech Stack & File Structure Overview

### 3.1 Tech Stack (Plain-English Summary)

| Part of the product | What powers it |
|---|---|
| The website & app itself | Next.js (a modern web framework) + React, written in TypeScript |
| Look and styling | Tailwind CSS |
| User accounts / sign-in | Clerk (a dedicated login service — handles passwords/security so this project doesn't have to) |
| Where user data & reports are stored | A MongoDB database, accessed through an ORM called Prisma |
| The "AI brain" behind everything | Google's Gemini AI model — reads CVs, writes interview questions, and scores answers |
| Reading uploaded CV files | Dedicated PDF/Word-document text extraction |
| Turning speech into text live | The browser's own built-in speech recognition (no extra service needed) |
| Downloadable PDF reports | Generated directly in the browser from the report the user is already looking at |
| Pop-up notifications | A lightweight toast-notification library |

### 3.2 File Structure Overview (High Level)

The codebase follows Next.js's standard "App Router" layout. The important parts, at a glance:

```
src/
├─ app/
│  ├─ (site)/                → all public + logged-in pages
│  │  ├─ page.tsx             → Home page
│  │  ├─ about/, contact/     → marketing pages
│  │  └─ dashboard/           → the actual product, once signed in
│  │     ├─ page.tsx          → main Dashboard (CV + interview setup)
│  │     ├─ history/          → past interviews list + individual reports
│  │     ├─ InterviewSetup.tsx    → role/level picker, orchestrates a session
│  │     ├─ InterviewSession.tsx  → the "Interview Room" recording screen
│  │     └─ InterviewReport.tsx   → the shared report layout (used everywhere a report is shown)
│  ├─ api/                    → backend logic the pages talk to
│  │  ├─ cv/                  → CV upload, parsing, saving
│  │  └─ interview/           → question generation, scoring, saving results
│  ├─ sign-in/, sign-up/      → login pages (Clerk-powered)
│  └─ layout.tsx              → the outermost page wrapper (fonts, auth, notifications)
├─ lib/
│  ├─ gemini.ts                → the shared connection to the AI model
│  └─ cv/                     → all the "thinking" logic:
│     ├─ parse-pdf.ts          → reads text out of an uploaded file
│     ├─ extract-with-gemini.ts → turns that text into a structured profile
│     ├─ generate-questions.ts  → turns a profile into 9 interview questions
│     └─ evaluate-interview.ts  → turns answers into a scored report
└─ components/                → reusable pieces (buttons, header, footer, page sections, etc.)

prisma/
└─ schema.prisma              → the definition of what gets stored in the database
```

**Rule of thumb:** almost anything about *how the product actually behaves* (the interview flow, scoring, the report) lives in `src/app/(site)/dashboard/` and `src/lib/cv/`. Almost everything else (`components/`, the rest of `(site)/`) is either shared visual building blocks or leftover marketing-template pages not central to the product.

---

## 4. What Gets Saved, and Where

For every user, the system keeps:
- Their **profile** (name, email, and the structured info pulled from their CV).
- Every **interview** they've taken (the role/level chosen, the 9 questions, their answers, how long it took).
- The **report** generated for that interview (all scores, strengths, improvements, summary, recommendation, and per-question feedback).

This is what makes the History page and PDF downloads possible — nothing about a past interview is regenerated later; it's the same report the user saw right after finishing.

---

## 5. Page Overview

| Page | What it's for |
|---|---|
| **Home** | Public landing page explaining what Mocki AI is and inviting people to try it |
| **About** | The story behind the project — why it exists, and how it's built |
| **Contact** | A simple way to reach out with feedback or bug reports |
| **Dashboard** | The main hub after signing in — upload CV, set up and start an interview, see recent activity |
| **History** | A list of every past interview with its score, and a link into the full report |
| **Sign in / Sign up** | Account creation and login, handled by Clerk |

Some other pages exist in the codebase left over from the design template this project started from (things like a pricing page, a shop page, a team page) — these aren't part of the real product and aren't linked from anywhere a user would actually go.

---

## 6. How "Confidence" / Face & Voice Evaluation Actually Works

This section is written so you can explain it clearly if asked directly (e.g. in a viva or a walkthrough) — what the system really does, in plain terms, without overclaiming.

**Q: Does the app analyze the user's face or voice in real time?**
No. The webcam and microphone are used to **record** the user while they answer — so the interview feels real, and so their spoken answer can be captured — but the app does not run facial-expression detection on the video, and it does not analyze tone/pitch from the audio. The only thing that's actually sent for AI evaluation is the **transcribed text** of what the user said (converted from speech to text live, in the browser, as they speak).

**Q: So where does the "Confidence Score" come from?**
The AI (Gemini) reads the transcript of all 9 answers and produces one overall Confidence score (0–100) as part of its evaluation, alongside the Technical and Communication scores — based on things like how the answer was phrased, its completeness, and its structure. It's a **language-based** judgment, not a biometric one.

**Q: Then what are "Face Score" and "Voice Score" in the report?**
Those two numbers are a **presentational breakdown** of the single Confidence score, split into two conceptual halves so the report reads more like a real interview-coaching report (e.g. "Neutral Face +20", "Good Voice Energy +20", "Too Many Pauses -10"). This split is calculated using simple, transparent rules — not measured from the camera or microphone:
- How many words the user gave per answer (very short answers count against "voice" signals).
- How many questions were skipped or answered (skipping counts against "face" signals like composure).
- The overall Confidence score itself, which anchors roughly half the value to each side.

The two numbers are built to add back up to the same overall Confidence score, just presented as two contributing "channels" instead of one number.

**Q: Is this a limitation, or intentional?**
Intentional. Real facial-expression recognition or vocal-tone analysis would require additional AI models, more processing time, and real infrastructure cost — not justified for a free personal project at this stage. If the product ever adds genuine camera/audio analysis in the future, this is the one piece of logic that would be replaced; everything else in the report (scores, strengths, improvements, per-question feedback) would stay the same.

**One-sentence summary if asked to explain it quickly:** *"The camera and mic are used to record the answer and capture what was said — the AI then scores the transcript for confidence, and the report presents that single score as a Face + Voice breakdown using simple rules, rather than actual video or audio analysis."*

---

## 7. Where To Go For Future Changes

| If you want to... | The relevant part of the system is... |
|---|---|
| Change how interview questions are generated | The question-generation logic (AI prompt + rules) |
| Change how answers are scored | The interview evaluation logic (AI prompt + scoring rules) |
| Change what the final report looks like | The shared report-display component — one change here updates it everywhere it's shown |
| Change the recording/interview screen | The "Interview Room" component |
| Add or change what's stored per interview | The database schema |
| Change the website's marketing pages | The Home, About, and Contact pages specifically (these are the ones written for this project — others are template leftovers) |

---

*This document describes the product as it stands after its most recent round of development: dashboard redesign, a full interview-room experience, history tracking with PDF export, and a cleaned-up public-facing website.*
