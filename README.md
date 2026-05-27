# 🎓 KidQuest

A joyful, gamified learning adventure for kids ages 4–14 that teaches History, Geography, Music, Math, General Knowledge & Trivia through bite-size lessons and interactive quizzes.

> **Stack:** React (Vite) · Tailwind CSS · Framer Motion · Zustand (with localStorage) · React Router v6 · Lucide React
>
> **No backend.** All content & progress are local. Mobile-first, tablet-friendly, offline-capable.

---

## ✨ Highlights

- **3 Age Groups** — Explorer (4–6), Adventurer (7–10), Champion (11–14). Each gets age-appropriate content, vocabulary, and question types.
- **6 Subjects** — History, Geography, Music, Math, General Knowledge, Trivia. Each has its own color, icon, and mascot character.
- **90 lessons** seeded across all subjects/age groups (5 lessons × 6 subjects × 3 age groups), with 3–5 questions per lesson.
- **Mastery system** — beginner → apprentice → expert → master. Lessons unlock progressively. 3 stars = mastered.
- **XP + Levels + Streaks + Badges** — frequent, satisfying rewards tied to learning progress.
- **Mascot-led UX** — six hand-drawn SVG mascots: Professor Owl, Captain Compass, DJ Dino, Robot Rex, Curious Cat, Party Panda.
- **Question variety** — image-tap, yes/no, multiple choice, fill-in-the-blank, true/false, and drag-to-order.
- **Parent zone** — PIN-protected (default `1234`). Time per subject, daily goal, age group switching, sound toggles, progress reset.
- **Confetti, level-ups, animated stars, page transitions** — delightful Framer Motion animations throughout.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview     # serves dist on :4173
```

---

## ☁️ Deploying to Vercel + Supabase

KidQuest is deployed as a static SPA on Vercel, with Supabase as the shared backend for leaderboard data.

### 1) Create Supabase project

1. Create a project at [Supabase](https://supabase.com/).
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy:
   - Project URL
   - Anon public key

### 2) Configure Vercel environment variables

Set these in **Vercel Project -> Settings -> Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3) Deploy to Vercel

Two ways:

#### Option 1 — Vercel Dashboard (easiest)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite. Verify:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`
4. Click **Deploy**. You'll get an alpha URL like `https://kidquest-xyz.vercel.app`.

#### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel              # preview deploy
vercel --prod       # production deploy
```

The included `vercel.json` handles:

- **SPA rewrites** — every non-asset route falls back to `/index.html` so React Router deep links (e.g. `/lesson/math-adv-001`) work on hard refresh.
- **Long cache** for hashed `/assets/*` (1 year, immutable) — instant subsequent loads.
- **Security headers** — `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.

### 4) Confirm shared leaderboard works

Open `Compete` tab and verify:
- leaderboard is marked `Supabase live`
- new speed runs appear when submitted from results screen.

---

## 🐳 Container Deployment

### Local container run

```bash
docker compose up --build
```

- App: `http://localhost:8080`
- Postgres (dev): `localhost:54329`

### Production container image

```bash
docker build -t kidquest:latest .
docker run --rm -p 8080:80 kidquest:latest
```

The Docker image serves optimized `dist/` via Nginx with SPA route fallback.

### Sharing the alpha

Send the Vercel URL. Each tester has their own progress saved in their browser's localStorage — there is no shared backend. To start fresh on a device, just clear site data or use the in-app **Settings → Danger Zone → Reset Progress**.

### Custom domain

In Vercel: **Project → Settings → Domains** → add your domain → follow DNS instructions. The `vercel.json` config requires no changes.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ui/              # Button, Card, ProgressRing, StarRating, BadgeChip
│   ├── quiz/            # QuestionCard, AnswerOption, QuizProgress
│   ├── lesson/          # ConceptCard
│   ├── rewards/         # XPBar, StreakFlame, ConfettiBlast, LevelUpModal
│   ├── mascots/         # Mascot (SVG), MascotSpeech, Avatar (builder)
│   └── layout/          # AppShell, TopBar, BottomNav, FloatingMascots
├── pages/
│   ├── Onboarding.jsx   # name + age + avatar (first run)
│   ├── Home.jsx         # Dashboard with subject cards
│   ├── Subject.jsx      # Lesson list with lock/mastery states
│   ├── Lesson.jsx       # Concept → Quiz state machine
│   ├── Results.jsx      # Stars, XP, badges, confetti, level up
│   ├── Profile.jsx      # Avatar editor + badge shelf + mastery
│   └── Settings.jsx     # Parent PIN-protected dashboard
├── store/
│   └── useAppStore.js   # Zustand store (persisted to localStorage)
├── data/
│   ├── history.json
│   ├── geography.json
│   ├── music.json
│   ├── math.json
│   ├── general-knowledge.json
│   ├── trivia.json
│   ├── subjects.js      # Subject registry + helpers
│   └── badges.js        # Badge catalog
├── hooks/
│   └── useQuiz.js
├── utils/
│   ├── scoring.js       # Stars + XP + level table
│   ├── content.js       # Per-subject progress / locking
│   └── badges.js        # Badge unlock rules
└── index.css            # Design tokens + Tailwind layers
```

---

## 🎨 Design system

- **Fonts:** `Baloo 2` (display/headings, chunky & playful) + `Nunito` (body, legible & warm).
- **Colors:** warm cream background, energetic orange primary, playful teal, sunshine yellow accent. Each subject has its own color.
- **Aesthetic:** chunky cards with thick borders + offset drop shadows (not blurry), pill-shaped buttons with 3D press effect.
- **Animations:** spring-y transitions, scale-bounce feedback, side-shake on wrong answers, confetti on 3-star wins.

---

## 🧠 Learning model

1. **Concept card** — one idea introduced with an emoji, a short kid-friendly explanation, and a fun fact.
2. **Quiz** — 3–5 questions, type varies by age group.
3. **Instant feedback** — green check (with bounce) or red X (with shake) overlay.
4. **Results** — animated stars (1/2/3), XP gain, badge unlocks, confetti for perfect scores.
5. **Mastery** — 3 stars to master a lesson. Mastered lessons unlock the next one.
6. **Adaptive difficulty** — question types and copy automatically scale by age group.

---

## 🧩 Adding new content

Add a new lesson by editing the appropriate JSON file in `src/data/`. Each lesson:

```json
{
  "id": "math-adv-006",
  "title": "Negative Numbers",
  "concept": {
    "text": "Numbers below zero are called negative. They show up in temperatures and money!",
    "emoji": "🌡️",
    "funFact": "The coldest temperature ever recorded was −89.2°C in Antarctica."
  },
  "questions": [
    { "type": "choice", "prompt": "Which is colder?", "options": ["−5°C", "0°C", "5°C"], "answer": "−5°C" },
    { "type": "fill", "prompt": "−10 + 5 = ____", "answer": "-5" }
  ]
}
```

Supported question types: `yes-no`, `choice`, `fill`, `tf`, `order`.

---

## 🔒 Parent zone

Visit **/settings** and enter PIN `1234` (changeable in-app). Lets you:

- Switch age group on the fly.
- Set daily lesson goals.
- View time spent per subject.
- Toggle sound effects & background music.
- Change PIN.
- Reset all learning progress (keeps profile + avatar + PIN).

---

## ✅ Accessibility & UX

- All tap targets ≥ 48×48 px.
- Generous typography (≥ 16px body, ≥ 24px headings).
- Focus rings on all interactive elements.
- WCAG-AA compliant text on backgrounds.
- No external links, no ads, no auth required.
- Encouraging tone — no "wrong" messaging; instead "good try, let's keep going!"

---

## 🛣️ Stretch ideas (v2)

- Web Speech API text-to-speech for Explorers.
- Multi-child profiles per device.
- Printable mastery certificates.
- Daily challenge mode.
- AI hint system (one Socratic nudge per question).
