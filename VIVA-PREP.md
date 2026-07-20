# Mocki AI — Viva Preparation

Likely viva questions (with answers) and short explanations of the important
topics in this project. **Ordered most-important → least-important.** The first
sections are the bare minimum you must know. Answers are kept short and simple —
say them in your own words.

---

## ⭐ Part A — Must Know (Bare Minimum)

### 1. What is your project? (one-liner)
A free **web app** where anyone can **practice job interviews by speaking their
answers out loud**. You upload your CV, an AI asks you tailored questions, you
answer using your camera and mic, and you get an instant AI-scored feedback report.

### 2. What technologies did you use and why?
| Tech | Role | Why |
|------|------|-----|
| **Next.js + React** | Builds the website and its backend | One tool for both the pages and the server logic |
| **TypeScript** | Language | Type safety, fewer bugs |
| **Tailwind CSS** | Styling | Quick, clean, responsive design with utility classes |
| **Clerk** | Authentication (login/sign-up) | Handles passwords and security safely for me |
| **MongoDB + Prisma** | Database | Stores users, interviews, and reports; Prisma makes it safe to query |
| **Google Gemini (AI)** | The "brain" | Reads CVs, writes questions, and scores answers |

### 3. How does an interview work, step by step?
Sign in → upload CV → the AI reads it and builds a profile → user picks a role
and experience level → AI creates **9 questions** → user answers each one out loud
with a **60-second timer** → the AI scores all the answers → a report is shown
instantly and saved for later.

### 4. Explain your project's architecture.
It's **one Next.js project** that holds both the frontend and backend:
- **Pages** (what the user sees) live in `app/(site)`.
- **API routes** (the server logic) live in `app/api` — they talk to the AI and database.
- **Core AI logic** (CV reading, question generation, scoring) lives in `lib/cv`.

The flow is: **browser → server (API route) → AI or database → back to the browser.**

### 5. Where is the data stored?
In a **MongoDB** database, in three parts:
- **User** — account info + the CV profile.
- **Interview** — the questions, the answers, and the chosen role/level.
- **Report** — the scores, strengths, improvements, and feedback.

Each user can have many interviews, and each interview has one report.

### 6. Does the AI really watch the video and listen to the voice?
**No — this is the most important point to say clearly.** The camera and mic are
only used to **record** the answer and **turn speech into text**. Only that **text**
is sent to the AI. The AI reads the text and scores it; it does **not** analyze the
face or voice directly.

---

## ⭐ Part B — Important (Very Likely Asked)

### 7. How does the CV upload work?
The user uploads a PDF or Word file. The app reads the text out of it, then sends
that text to the AI, which pulls out useful details like name, skills, years of
experience, and education.

### 8. How are the interview questions created?
The app sends the user's profile, chosen role, and experience level to the AI, and
asks it to write **9 questions** tailored to that person, ordered from easier to harder.

### 9. How is the feedback report scored?
After the interview, all the answers (as text) are sent to the AI. It returns an
overall score, plus separate scores for **technical skill, communication, and
confidence**, along with strengths, areas to improve, and feedback for each question.

### 10. What is the "Confidence Score" and its Face/Voice split?
The AI gives **one** confidence score by reading the answers. The report then shows
it as a **"Face + Voice" breakdown** to make it feel like real interview coaching
(e.g. "Neutral Face +20", "Too Many Pauses −10"). That split is based on simple
things like how much the person spoke and how many questions they skipped — **not**
on actually analyzing the camera or audio.

### 11. How do you actually detect nervousness, tone, or body language from the video and voice?
The confidence score comes from **reading what the person said** — how clearly and
fully they answered, and whether they skipped or rushed questions. It's shown as a
Face/Voice breakdown so it feels like real interview coaching. Truly analyzing the
camera and voice would need extra, expensive technology, so for a free tool I chose
the simpler text-based approach on purpose — and the app is built so real face/voice
analysis could be added later.
**One-line answer if rushed:** *"The AI scores what the person said as text and shows
it as a Face/Voice breakdown — it doesn't really analyze the video or voice."*

### 12. How does the live speech-to-text work?
The web browser has a **built-in feature** that turns speech into text. As the user
speaks, their words appear on the screen in real time. No extra outside service is needed.

### 13. How can the user download their report?
There's a "Download PDF" button. It takes a picture of the on-screen report and
turns it into a PDF file, right in the browser.

### 14. How does login work?
A service called **Clerk** handles all the sign-in and sign-up, including passwords,
so I don't handle them myself. Private pages like the dashboard and history are
**locked** — anyone not logged in is automatically sent to the sign-in page.

---

## ⭐ Part C — Good to Know (May Be Asked)

### 15. Does the user pick their experience level, or is it automatic?
It's **suggested automatically** based on the years of experience in their CV
(like Fresher, Junior, Senior), but the user can change it before starting.

### 16. How does the app remember things during an interview?
The app keeps track of the **current question, time left, and the live transcript**
in the browser's memory while the interview is running.

### 17. What happens right after the user finishes?
The report appears on screen **instantly**, and it's saved to the database in the
background. If saving fails, the user still sees the report and gets a small error message.

### 18. How does the History page work?
It shows a list of all the user's past interviews with their date and score.
Clicking one **opens the full report again**, which they can re-download as a PDF.

### 19. Why 9 questions and a 60-second timer?
9 questions is a full but not tiring round — enough to cover a good mix of general
and job-related questions. The 60-second timer adds light time pressure, like a real interview.

### 20. Is it a paid product?
No, it's **completely free** — a personal project, not a business. No payment, no subscription.

---

## 📌 Short Explanations of Key Concepts

**Next.js / React** — the tools used to build the website and its behind-the-scenes logic.

**TypeScript** — the coding language; a safer version of JavaScript that catches
mistakes early.

**Tailwind CSS** — a quick way to style and design the pages using small utility classes.

**Clerk** — a ready-made service that handles user login and passwords securely.

**MongoDB** — the database where all the user, interview, and report data is stored.

**Prisma** — a helper that makes talking to the database easier and safer.

**Gemini (AI model)** — Google's AI that reads CVs, writes questions, and scores answers.

**Prompt** — the instruction we give the AI telling it exactly what to do.

**Transcript** — the text version of what the user said out loud.

**Speech-to-text** — turning spoken words into written text (done by the browser).

**API / backend** — the server side of the app that does the "thinking" (talks to
the AI and database).

**Middleware** — a gatekeeper that checks if a user is logged in before letting them
into a private page.

---

## 💡 Tricky Questions — Be Ready

**Q: "You said it scores confidence from video and voice — how exactly?"**
The confidence score comes from reading the **answer text** — how clearly and fully
the person spoke, and whether they skipped or rushed questions. It's shown as a
Face/Voice breakdown to feel like real coaching. Truly analyzing the camera and
voice would need extra, expensive technology, so I chose the simpler text-based
approach on purpose for a free project — and the app is built so real face/voice
analysis could be added later.

**Q: Why MongoDB instead of a traditional (SQL) database?**
An interview has flexible, nested data — lists of questions, answers, and feedback.
MongoDB stores that kind of data very naturally, so it was a good fit.

**Q: Why use Clerk instead of building your own login?**
Login and security are easy to get wrong and risky to build from scratch. Clerk
does it safely and quickly, so I could focus on the actual interview features.

**Q: What happens if something fails — the internet drops or the AI gives bad data?**
The app is built to fail safely. If the AI response is broken, it shows a clear
error instead of crashing. If the camera/mic is blocked, it shows a helpful message
explaining why. If saving fails, the user still sees their report.

**Q: Is it secure? Can one user see another user's interviews?**
No. Every request checks who's logged in, and the app only ever fetches that
person's own data. Passwords are handled entirely by Clerk, and only the **text**
of answers — never the actual video or audio — leaves the browser.

**Q: What would you improve with more time?**
Add real facial and voice analysis, make the report saving more reliable, offer more
question variety, and show progress charts so users can see their scores improve over time.

---

## ✅ 30-Second Summary (memorize this)

> "Mocki AI is a free web app for practicing job interviews. You sign in, upload
> your CV, and an AI reads it and creates 9 tailored questions. You answer them out
> loud using your camera and mic, your speech is turned into text, and the AI scores
> your answers — giving an overall score plus feedback on technical skill,
> communication, and confidence. Everything is saved to a history page and can be
> downloaded as a PDF. One key point: the AI scores your spoken answers as *text* —
> it doesn't do real video or voice analysis — a deliberate choice to keep this free
> project simple while still giving useful feedback."
