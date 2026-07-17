# Mocki AI — Project Documentation

> A free, voice-based AI mock interview practice platform. Speak your answers out loud to real interview questions, get AI-generated feedback, and track your progress over time.

This document is written for **future-you** (or anyone else) coming back to this codebase after a break — to relearn the architecture fast and know where to make changes safely.

---

## 1. What This Project Is

Mocki AI lets a user:

1. Upload their CV (PDF/DOCX) → AI extracts structured profile data (name, skills, experience, education, industry).
2. Pick an industry/role and experience level for the mock interview.
3. Get 9 AI-generated interview questions tailored to their profile.
4. Answer each question **out loud** via webcam + mic (not by typing).
5. Get an AI-generated performance report: overall score, technical/communication/confidence sub-scores, strengths, improvements, per-question feedback.
6. See every past interview + report saved in **History**, and download any report as a PDF.

It's a **personal/free project**, not a SaaS product — no payment, no team, no "trusted by X companies" claims. Marketing copy across the site (home, about, contact, footer) should stay honest to that.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Clerk (`@clerk/nextjs`) |
| Database | MongoDB via Prisma ORM |
| AI | Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` |
| File parsing | `pdf-parse` (PDF), `mammoth` (DOCX) |
| PDF export | `jspdf` + `html2canvas-pro` (client-side screenshot → PDF) |
| Toasts | `react-hot-toast` |
| Speech-to-text | Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) — no server-side STT |
| Icons | `lucide-react` + `react-feather` (both used, inconsistently, across the codebase) |

**Package manager / scripts:** standard `npm run dev|build|start|lint`.

---

## 3. Environment Variables

Defined in `.env` (not committed as real values — see `.env.example` for the *template*'s own irrelevant vars, which are NOT what this project actually uses).

Actual vars this project needs:

```
DATABASE_URL=                                   # MongoDB connection string (Prisma)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=              # Clerk public key (pk_test_... or pk_live_...)
CLERK_SECRET_KEY=                               # Clerk secret key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
GEMINI_API_KEY=                                 # Google Generative AI key
```

⚠️ **`pk_test_...` vs `pk_live_...`**: while on a `pk_test_...` key, Clerk shows a "Development mode" badge and forces its "Secured by Clerk" branding footer (only removable on a paid Clerk plan, or hidden locally via `globals.css` overrides — see §9).

---

## 4. Database Schema (MongoDB via Prisma)

File: `prisma/schema.prisma`. Client generated to `src/generated/prisma` (custom output path — import as `@/generated/prisma/client`, not the default `@prisma/client`).

```
User
 ├─ clerkId (unique)       — links to Clerk's user id
 ├─ email (unique)
 ├─ name, image
 ├─ cvMarkdown              — raw extracted CV text
 ├─ cvData (Json)           — structured CVData (see §6.1)
 ├─ cvUploadedAt
 └─ interviews[] ───────────┐
                             │
Interview                   │
 ├─ userId ──────────────────┘ (belongs to User)
 ├─ industry, level
 ├─ questions (Json)        — string[] of the 9 questions
 ├─ answers (Json)          — [{question, transcript, skipped}]
 ├─ duration (seconds)
 ├─ transcript              — flattened Q/A text blob
 ├─ completed (bool)
 └─ report? ─────────────────┐ (1:1, optional)
                              │
Report                       │
 ├─ interviewId (unique) ────┘
 ├─ overallScore, technicalScore, communicationScore, confidenceScore
 ├─ strengths[], improvements[]
 ├─ summary, recommendation
 ├─ cameraFeedback (Json)   — ConfidenceActivity[] (see §6.3)
 └─ voiceFeedback (Json)    — AnswerEvaluation[] (per-question breakdown)
```

**Important:** `Report` does **not** store `faceScore`/`voiceScore` as columns — those are *derived at read time* from `cameraFeedback` (see §6.3). If you ever need them persisted for performance, add columns and backfill; right now they're always recomputed.

---

## 5. Routing Map

### Public marketing pages (`src/app/(site)/...`)
Most of this is leftover from the **Exsit Next.js template** this project was built on top of — many routes (`/pricing`, `/team`, `/shop-1`, `/checkout`, etc.) are template boilerplate never wired to real functionality. Pages that have been **intentionally rewritten** for Mocki AI:

| Route | Status |
|---|---|
| `/` (home) | Rewritten — hero, "why practice with Mocki AI", how it works, FAQ, CTA |
| `/about` | Rewritten — honest solo-project story, no fake team/stats |
| `/contact` | Lightly rewritten — real copy, reuses `Brands` component, no fake FAQ |
| `/dashboard/*` | Fully custom, this is the actual product |
| `/sign-in`, `/sign-up`, `/registers` | Clerk-hosted auth |

Everything else under `(site)` (pricing, team, shop-*, checkout, blog-*, changelog, terms, privacy) is template scaffolding — check before assuming it's "done" or linked from real navigation.

### Dashboard (the actual product) — `src/app/(site)/dashboard/`

| Route | Purpose |
|---|---|
| `/dashboard` | Main hub: CV upload/summary, interview setup, recent activity, past reports |
| `/dashboard/history` | Table of all past interviews (industry, date, status, score, readiness badge, report link) |
| `/dashboard/history/[id]` | Full report for one saved interview |
| `/dashboard/interview-preview` | **Dev-only** — preview the Interview Room UI without a real session (404s outside `NODE_ENV=development`) |
| `/dashboard/history-preview` | **Dev-only** — preview the History table with dummy rows |
| `/dashboard/history-preview/report/[id]` | **Dev-only** — preview a report page with mock data |

All dashboard routes are protected by `src/middleware.ts` (Clerk `auth.protect()` on `/dashboard(.*)`, `/interview(.*)`, `/history(.*)`, `/report(.*)`).

### API routes — `src/app/api/`

| Route | Method | Purpose |
|---|---|---|
| `/api/cv/upload` | POST | Upload PDF/DOCX → parse text → extract structured data via Gemini → save to `User` |
| `/api/cv/extract` | POST | Re-run Gemini extraction on already-parsed text (used internally) |
| `/api/cv/save-data` | POST / DELETE | Save edited CV data / remove CV entirely |
| `/api/interview/generate-questions` | POST | Gemini generates 9 questions from CV + industry + level |
| `/api/interview/evaluate` | POST | Gemini scores the completed interview (see §6.4 for exact shape) |
| `/api/interview/save` | POST | Persists `Interview` + `Report` to MongoDB (fire-and-forget from the client — see §8 known gap) |

Every route does `currentUser()` from `@clerk/nextjs/server` and 401s if not signed in.

---

## 6. Core Domain Logic (`src/lib/cv/` and `src/lib/gemini.ts`)

All Gemini calls go through one shared model instance:

```ts
// src/lib/gemini.ts
export const geminiFlash = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

Every Gemini-calling function follows the same pattern: build a prompt asking for **raw JSON only**, strip markdown code fences from the response, `JSON.parse`, and fall back to safe defaults if a field is missing.

### 6.1 `extract-with-gemini.ts` — CV → structured data

```ts
type CVData = {
  name: string;
  email?, phone?, linkedinUrl?: string | null;
  skills: string[];
  experienceYears: number;
  currentRole?: string | null;
  education: string;
  summary: string;
  industry?: string | null;
  jobTitles?: string[] | null;
};
```
`extractCVData(rawText)` — one Gemini call, parses the CV text into this shape.

### 6.2 `generate-questions.ts` — CV + role → 9 questions

`generateInterviewQuestions(cvData, industry, level)` → `string[]` (always exactly 9, easy→hard, mixed behavioral/technical).

### 6.3 `evaluate-interview.ts` — the most important file

`evaluateInterview(answers, industry, level)` → `InterviewEvaluation`:

```ts
interface InterviewEvaluation {
  overallScore, technicalScore, communicationScore, confidenceScore: number;
  faceScore, voiceScore: number;        // derived, see below
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: string;
  answerEvaluations: AnswerEvaluation[];        // per-question: relevance/clarity/confidence/feedback
  confidenceActivities: ConfidenceActivity[];   // display-only breakdown, e.g. "Smile +20"
}
```

**How `faceScore`/`voiceScore` actually work (important, non-obvious):**
- Gemini only returns one `confidenceScore` (0–100) — there is **no real webcam emotion detection or voice-tone analysis** in this project.
- `buildConfidenceActivities()` is a local heuristic (not AI) that fabricates a plausible-looking list of "activities" (e.g. "Neutral Face +20", "Too Many Pauses -10") based on simple rules: word count, skip ratio, and the confidence score's magnitude.
- Each activity is tagged `channel: "face" | "voice"`.
- `computeChannelScore()` splits `confidenceScore` roughly in half between the two channels, nudged up/down by that channel's activity points.
- **This is cosmetic, not measured.** If a future version does real camera/audio analysis, this whole derivation should be replaced with actual signal-based scores — don't assume `faceScore`/`voiceScore` are scientifically meaningful today.

### 6.4 `parse-pdf.ts` — file text extraction

- PDF → `pdf-parse` (loaded via `eval("require")` — a workaround, not a typo; check this if PDF parsing breaks after a dependency upgrade).
- DOCX → `mammoth`.

---

## 7. The Interview Flow, End-to-End

This is the flow that matters most — trace it here before touching any part of it.

```
1. User visits /dashboard
   → CVSection.tsx: upload CV or shows existing CV summary
   → POST /api/cv/upload → parseCVFile → extractCVData → saved to User.cvData

2. InterviewSetup.tsx (shown once CV exists)
   → user picks Industry + Experience Level (pre-filled from CV)
   → "Start Interview" → browser requests camera+mic via getUserMedia
     (permission errors are now handled with specific messages: blocked,
      insecure-origin, no-device, in-use-by-another-app — see the
      requestPermissionAndGenerate function)
   → POST /api/interview/generate-questions → 9 questions

3. InterviewSession.tsx (full-screen dark UI, "Interview Room")
   → one question at a time, 60s timer per question
   → user clicks "Record Answer" → MediaRecorder captures audio,
     Web Speech API live-transcribes in parallel
   → "Submit & Next" or "Skip" → advances; last question → onComplete(answers)

4. Back in InterviewSetup.tsx: handleSessionComplete()
   → POST /api/interview/evaluate → Gemini scores everything → InterviewEvaluation
   → setStage("report") — user sees the report IMMEDIATELY
   → in parallel (fire-and-forget): POST /api/interview/save
     → persists Interview + Report to MongoDB
     → success/failure toast now shown to the user (react-hot-toast)

5. InterviewReport.tsx renders the report (used in 3 places — see §7.1)
   → "Download as PDF" button: html2canvas-pro screenshots the report
     DOM node → jsPDF assembles pages → browser download
```

### 7.1 `InterviewReport.tsx` is shared across three call sites

1. `InterviewSetup.tsx` — right after a live interview finishes (real data, `candidateName={cvData.name}`).
2. `dashboard/history/[id]/page.tsx` — viewing a saved report from History (real data, `candidateName` from Clerk `user.firstName`).
3. `dashboard/history-preview/report/[id]/page.tsx` — dev-only preview using `mockInterviewEvaluation` from `lib/cv/mock-evaluation.ts`.

If you change the report's layout/branding, you generally only need to touch this one file — all three call sites will pick it up.

### 7.2 Known gap: fire-and-forget save

`InterviewSetup.tsx`'s `handleSessionComplete()` fires `/api/interview/save` without `await`-ing it into the main flow. If it fails, the user still sees their report on-screen (fine), and now gets an error toast (fixed), but **the interview will silently not appear in History**. There's no retry mechanism. If this becomes a real problem, consider making save a blocking step before showing the report, or adding a retry/queue.

---

## 8. Dashboard UI Structure

```
dashboard/
├─ layout.tsx          — client component, owns sidebar collapsed state, renders DashboardSidebar
├─ DashboardSidebar.tsx — white sidebar: logo, collapse toggle, nav (Dashboard/Reports), user menu
├─ page.tsx             — server component: fetches user + stats + recent interviews (Prisma), renders DashboardClient
├─ DashboardClient.tsx   — client wrapper: CVSection + (InterviewSetup or RecentActivity)
├─ CVSection.tsx         — upload dropzone OR CV summary card (two render branches)
├─ CVDataPreview.tsx     — editable CV data review/confirm screen after upload
├─ InterviewSetup.tsx    — industry/level picker → permission flow → orchestrates the whole interview
├─ InterviewSession.tsx  — the actual "Interview Room" full-screen recording UI
├─ InterviewReport.tsx   — shared report renderer (see §7.1)
├─ LoginToast.tsx        — reads ?login=success|welcome from URL, shows toast once, cleans URL
└─ history/, history-preview/  — see §5 routing table
```

**Sidebar navigation speed tip (learned the hard way):** Clerk's `<UserButton.Link>` renders a plain `<a>` and triggers a **full page reload**, unlike Next.js's `<Link>`. Both `Header.tsx` and `DashboardSidebar.tsx` now use `<UserButton.Action onClick={() => router.push(...)}>` instead, for fast client-side navigation. If you add more Clerk menu items anywhere, use `Action`, not `Link`, unless you specifically want a hard navigation.

### 8.1 Dashboard performance notes

- `dashboard/page.tsx` runs **6 parallel Prisma queries** (`Promise.all`) instead of one deeply-nested `include` — each query only `select`s the fields actually needed (e.g. avoids pulling full `Report` JSON blobs just to show a count).
- `loading.tsx` files exist at `dashboard/`, `dashboard/history/`, `dashboard/history/[id]/` for instant skeleton UI on navigation (Next.js route-level Suspense).
- If dashboard queries get slow again as data grows, check whether a new `include: { report: true }` crept back in somewhere that only needs a `select`.

---

## 9. Dev-Only Features (gated by `NODE_ENV === "development"`)

These exist purely to let you iterate on UI without running a full real interview each time. All return `notFound()` in production.

| Feature | Where | What it does |
|---|---|---|
| "Load Sample Report" button | `InterviewSetup.tsx` | Instantly shows `mockInterviewEvaluation` as if an interview just finished |
| "Preview Interview Room UI" | `/dashboard/interview-preview` | Full Interview Room UI with a **dummy camera stream** (canvas-generated black video + silent audio) — lets you test the UI even if your webcam is blocked/unavailable |
| "Preview History Table" | `/dashboard/history-preview` | 6 dummy interview rows across all score/status ranges, no DB needed |
| Preview report detail | `/dashboard/history-preview/report/[id]` | Renders `InterviewReport` with mock data |

`mock-evaluation.ts` (`src/lib/cv/mock-evaluation.ts`) is the single source of dummy evaluation data — keep it in sync with `InterviewEvaluation`'s shape whenever that type changes (TypeScript will complain if you forget, e.g. it did when `faceScore`/`voiceScore`/`channel` were added).

---

## 10. Styling & Branding Conventions

- Tailwind v4, utility-first, no CSS modules.
- Dashboard = **white/light theme**. Interview Room (`InterviewSession.tsx`) = **dark theme** (`#0A0D16` background family) — intentionally different, it's meant to feel like a real interview call.
- Logo path used everywhere: `/images/logo/logo.png` (light) with a `-white` suffix variant for dark backgrounds (`getDarkLogo()` helper pattern repeated in `Header.tsx`/`Footer.tsx`).
- Brand name constant: `"Mocki Ai"` / `"Mocki AI"` (capitalization is inconsistent across the codebase — not a bug, just pick one when you touch a file).
- Clerk's "Secured by Clerk" branding is force-hidden via raw CSS in `globals.css` (selectors like `.cl-footer`, `[data-localization-key="footer.poweredBy"]`) — **this is explicitly a local/dev-only override**, not something to rely on in production; Clerk's free-tier branding requirement isn't actually removable without a paid plan, and this CSS hack could break on a Clerk version bump.

---

## 11. Things That Will Bite You Later (gotchas list)

1. **Prisma client import path is non-default**: `import { PrismaClient } from "@/generated/prisma/client"` — NOT `@prisma/client`. The `generator client { output = "../src/generated/prisma" }` line in `schema.prisma` is why. If Prisma imports suddenly break, check this first.
2. **`pdf-parse` is loaded via `eval("require")`** in `parse-pdf.ts` — a deliberate workaround (likely for a bundler/ESM interop issue), not dead code to clean up.
3. **Two sign-in routes exist**: `/sign-in` (root-level, `src/app/sign-in/`) and `/registers` (inside `(site)`, using Clerk's catch-all `[[...registers]]` pattern). Both point to Clerk and redirect to `/dashboard`. Check which one your nav links actually use before assuming there's one canonical sign-in page.
4. **`react-feather` and `lucide-react` are both used** for icons, inconsistently, across old template files vs. newly-written dashboard code. Not a mistake to "fix" wholesale — just be aware both exist.
5. **Confidence/Face/Voice scores are heuristic, not measured** (see §6.3) — don't build features that treat them as ground truth (e.g. don't claim "we detected you smiled 3 times" in copy).
6. **Fire-and-forget interview save** (§7.2) — a completed interview can show its report on-screen but fail to appear in History if the save API call fails silently in the background.
7. **Most of `(site)/*` is unused template scaffolding** — before "fixing" a page like `/pricing` or `/team`, check whether it's actually linked from anywhere real, or just inherited cruft from the Exsit template this was built on.
8. **Only run one dev server at a time.** Running `npm run dev` on multiple ports simultaneously (which happened during development) plus a stale `.next` cache can produce a genuinely broken-looking UI that has nothing to do with the source code. If the UI looks broken and the code looks fine, kill all `next dev` processes, delete `.next/`, and restart clean before debugging further.
9. **Dashboard routes 404 for anonymous `curl` requests** — this is expected Clerk middleware behavior (redirect-to-sign-in manifests as a 404 to unauthenticated tools), not a routing bug.

---

## 12. Where To Look When You Need To...

| Task | Start here |
|---|---|
| Change interview question generation | `src/lib/cv/generate-questions.ts` |
| Change how interviews are scored | `src/lib/cv/evaluate-interview.ts` |
| Change the report's layout/content | `src/app/(site)/dashboard/InterviewReport.tsx` (affects all 3 call sites) |
| Change the Interview Room recording UI | `src/app/(site)/dashboard/InterviewSession.tsx` |
| Change what's stored per interview | `prisma/schema.prisma` (remember to `npx prisma generate` / migrate after schema changes) |
| Add a new dashboard nav item | `src/app/(site)/dashboard/DashboardSidebar.tsx` — `NAV_ITEMS` array |
| Add a new dev-only preview route | Follow the pattern in `dashboard/interview-preview/` or `dashboard/history-preview/` — `notFound()` unless `NODE_ENV === "development"` |
| Change CV parsing/extraction | `src/lib/cv/parse-pdf.ts` (raw text) → `src/lib/cv/extract-with-gemini.ts` (structured data) |
| Change marketing site copy | `src/app/(site)/page.tsx` (home), `about/page.tsx`, `contact/page.tsx` — these are the ones actually rewritten for this project |
| Fix a slow navigation involving Clerk's UserButton | Make sure it uses `UserButton.Action` + `router.push`, not `UserButton.Link` |

---

*Last significant rewrite context: dashboard sidebar redesign, Interview Room dark-theme UI, History table + dev preview routes, Prisma query optimization, Face/Voice confidence-score breakdown, and marketing-page cleanup (home/about/contact) — all done incrementally across one long working session. Check `git log` for the actual commit-by-commit history.*
