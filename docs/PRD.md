# KidQuest — Product Requirements Document (PRD)

**Version:** 1.0 (community platform vision)  
**Last updated:** May 2026  
**Owner:** Vinay  
**Status:** Strategic north star — implementation tracked in [ROADMAP.md](./ROADMAP.md)

---

## 1. Executive summary

KidQuest is a **kids-first learning community** where children explore real-world topics through games, missions, stories, and parent-guided activities — while parents, teachers, and vetted contributors shape what gets built next.

**Default audience:** ages **4–13** (COPPA-conscious, parent-gated).  
**Optional mode:** **Teen Explorer** ages **13–18** (more autonomy, deeper topics, less childish UI).

**North star:** Feel like a **fun adventure**, not a school app — while building life skills (money sense, communication, problem-solving, civic awareness, practical independence) and a **sustainable + social-good** business model.

---

## 2. Product vision

> A global, joyful place where curiosity wins, parents participate (not just monitor), the best ideas come from the community (safely vetted), and every paid family can help unlock learning for another child.

### 2.1 What makes KidQuest unique

| Differentiator | Description |
|----------------|-------------|
| **Learning from life** | Missions beyond traditional subjects — budgeting, cooking, empathy, AI literacy, safety, sustainability, careers. |
| **Parent–child co-learning** | Shared missions + discussion prompts turn screen time into conversation and real-world action. |
| **Vetted crowdsourcing** | Parents, teachers, and experts submit ideas; moderation + expert review before kids see anything. |
| **Effort over speed** | Points, badges, streaks reward curiosity, reflection, and persistence — not only fast quiz clicks. |
| **Built-in social good** | Freemium core + subscriptions that fund seats for underprivileged learners (see §10). |

### 2.2 Alignment with current product (v0.2 alpha)

KidQuest **already ships** foundations this PRD extends:

| Pillar (today) | Shipped foundation | PRD extension |
|----------------|-------------------|-----------------|
| Learn | 5-phase mastery (mul, geo, solar), lessons JSON, daily challenge | Life-skills mission tracks, community mission packs |
| Explore | Geography map, Solar explorer, Life Explorer map | Real-world mission outcomes, offline packs |
| Create | Journals, stories, Life Explorer | Crowdsourced “remix” templates, kid-safe idea submissions |
| Compete | Speed run, Daily Duel, friends (invite code) | Team quests, async duels, no open kid chat |
| Trust | Auth, RLS, parent PIN, COPPA consent gate (explorer) | Full consent flow, UGC moderation pipeline, teen mode |

---

## 3. User personas

### 3.1 Child — “Curious Explorer” (primary)

- **Ages:** 4–13 (default); 13–18 in Teen mode.  
- **Goals:** Have fun, earn rewards, feel capable, share creations safely.  
- **Needs:** Short sessions, audio/visual support, clear next step, no harsh failure copy.  
- **Constraints:** Limited reading; no open social graph; no location sharing.

### 3.2 Parent — “Guide & Guardian”

- **Goals:** Meaningful screen time, visibility into progress, age-appropriate content, family values.  
- **Needs:** Dashboard, controls (time, topics, approvals), discussion prompts after missions, multi-child profiles.  
- **Jobs:** Approve child accounts (under 13), set goals (“learn budgeting”), review digests.

### 3.3 Contributor — “Teacher / Expert / Mentor”

- **Goals:** Share activities that help real kids; get credit; optional revenue share (future).  
- **Needs:** Submission templates, tagging (age, topic, time, offline/online), status of review.  
- **Constraints:** Must pass moderation; no direct contact with minors.

### 3.4 Admin / Moderator — “Trust & Quality”

- **Goals:** Keep platform safe and high-quality; fast takedown; audit trail.  
- **Needs:** Review queue, filters, reports, ban/suspend, analytics on UGC funnel.

---

## 4. Age bands & interaction levels

| Band | Ages | UI tone | Social | Parent gate |
|------|------|---------|--------|-------------|
| **Explorer** | 4–7 | Max visuals, TTS, simple taps | None | Required |
| **Adventurer** | 8–11 | Balanced game UI | Friends via parent-approved codes only | Required if &lt;13 |
| **Champion** | 12–13 | More text, faster challenges | Async compete only; no open chat | Consent + PIN |
| **Teen** (opt-in) | 13–18 | Mature layout, deeper topics | Stricter policies; still no open kid DMs | Self + parent link optional |

**Rule:** Under **13** → verifiable **parental consent** before personal data collection; minimize data; parent rights to review/delete (COPPA-aligned).

---

## 5. User stories (MVP+)

### Child

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| C-1 | As a kid, I complete a daily mission and earn badges so I feel progress. | P0 | 🟡 Partial (daily challenge, badges) |
| C-2 | As a kid, I play missions that mix quiz + creativity + reflection. | P0 | 🟡 Lessons + Life Explorer |
| C-3 | As a kid, I submit an **idea** (text template only) for a future mission. | P1 | ⬜ |
| C-4 | As a teen, I opt into Teen mode with deeper topics. | P2 | ⬜ |

### Parent

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| P-1 | As a parent, I create/link child profiles and set age band. | P0 | 🟡 Roles + child_profiles table; UI partial |
| P-2 | As a parent, I see time, skills, weak areas, and discussion prompts. | P0 | 🟡 Settings digest, weak areas |
| P-3 | As a parent, I set screen time caps and topic filters. | P1 | 🟡 Screen time pref; topic filters ⬜ |
| P-4 | As a parent, I approve social features (friends/compete) for under-13. | P0 | 🟡 ParentConsentGate |
| P-5 | As a parent, I set a family goal (“money sense this month”). | P2 | ⬜ |

### Contributor

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| R-1 | As a teacher, I submit a mission idea with age/tags/time metadata. | P1 | ⬜ |
| R-2 | As a contributor, I see review status and published missions. | P2 | ⬜ |
| R-3 | As community, I upvote/remix vetted ideas (no kid-visible raw UGC). | P2 | ⬜ |

### Admin

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| A-1 | As mod, I review submissions in a queue before publish. | P0 | ⬜ |
| A-2 | As mod, I action abuse reports within SLA. | P0 | ⬜ |
| A-3 | As admin, I view engagement/retention/completion analytics. | P1 | 🟡 Local stats; cloud ⬜ |

---

## 6. Functional requirements

### 6.1 Child experience

- Age-based onboarding: interests, reading level, **interaction tier**.  
- **Missions:** daily/weekly; mix curiosity, creativity, real-world follow-up.  
- **Rewards:** points, badges, streaks, levels — **effort-weighted** (attempts, reflection, not only speed).  
- **Modalities:** audio, visuals, quizzes, story quests (younger); teen UI variant.  
- **Learning loop** (every mission):  
  1. Spark (question/story)  
  2. Guide (interactive task)  
  3. Reward (points/badge)  
  4. Reflect (mini-journal / parent prompt)  
  5. Real world (offline follow-up)

**Topic expansion (life skills):** money & entrepreneurship, cooking & nutrition, communication & empathy, AI literacy, civic responsibility, safety & first aid, environment, career awareness.

### 6.2 Parent experience

- Dashboard: time, skills, progress, **discussion cards** post-mission.  
- Controls: screen time, age/topic filters, approval for social/compete features.  
- Family goals and multi-child comparison (siblings).  
- Weekly digest (email) + CSV/PDF export.

### 6.3 Crowdsourcing engine

- Submission templates (structured fields, no free-form HTML from kids).  
- Tags: age band, topic, difficulty, duration, online/offline.  
- Workflows: submit → auto-filter → mod queue → expert optional → publish → vote/remix (adults only).  
- **Kids never see unmoderated UGC.**

### 6.4 Safety & trust (non-negotiable)

| Rule | Implementation target |
|------|------------------------|
| No open kid–kid chat | ✅ No chat; friends = invite codes + async duels only |
| No public minor profiles | ✅ Display names only; no public profile URLs |
| No location sharing | ✅ Life map pins private to account |
| No kid DMs | ✅ Enforced |
| UGC moderation | ⬜ Queue + human review ([MODERATION.md](./MODERATION.md)) |
| COPPA consent &lt;13 | 🟡 Consent gate; full verifiable consent ⬜ |
| Report / block / takedown | ⬜ Phase 8 |

Detail: [MODERATION.md](./MODERATION.md).

---

## 7. Data model (conceptual)

Extends existing Supabase schema (`supabase/schema.sql`).

| Entity | Purpose |
|--------|---------|
| `profiles` | User identity, role, age_group, avatar |
| `child_profiles` | Parent-owned child records (multi-kid) |
| `user_preferences` | Locale, a11y, screen time, consent timestamps |
| `lesson_progress` / `mul_*` / `geo_*` | Mastery & SRS |
| `assignments` / `classrooms` | Teacher → kid tasks |
| `life_explorer_items` | Create tab: pins, journals, stories |
| `daily_duels` / `friend_links` | Safe social compete |
| **`missions`** (new) | Published mission packs (curated + approved UGC) |
| **`mission_completions`** (new) | Child progress per mission |
| **`ugc_submissions`** (new) | Contributor ideas in review |
| **`ugc_votes`** (new) | Adult voting on approved candidates |
| **`family_goals`** (new) | Parent-set monthly goals |
| **`sponsor_packs`** (new) | Sponsored mission metadata |
| **`scholarship_seats`** (new) | Donor-funded access grants |

---

## 8. MVP scope (prove safety + engagement)

### 8.1 In scope (next 90 days)

| Item | Notes |
|------|--------|
| Parent account + **2 child profiles** | Extend `child_profiles` UI |
| **50–100 curated missions** | Start with JSON packs; 5–8 life-skill topics |
| Reward loop + parent dashboard v2 | Discussion prompts per mission |
| **Contributor submit form** (parents/teachers) | Writes to `ugc_submissions` only |
| **Mod review queue** (admin role) | Approve/reject/publish |
| Basic **freemium** flag + “Plus” placeholder | Stripe later |
| Impact counter on `/impact` | Anonymous aggregates |
| COPPA consent flow v1 | Parent email attestation |

### 8.2 Out of scope (post-MVP)

- Open kid chat or forums  
- Public kid profiles or follower graphs  
- Unmoderated publishing  
- Full teen social graph  
- Automated weekly email (until transactional email provider + compliance review)

### 8.3 Already shipped (alpha baseline)

See [ROADMAP.md § What is shipped today](./ROADMAP.md#what-is-shipped-today).

---

## 9. Non-functional requirements

| Area | Requirement |
|------|-------------|
| **Privacy** | Minimize PII; parental access/delete; no behavioral ads to kids |
| **Security** | RLS on all tables; rate limits on submits and duels |
| **Accessibility** | WCAG AA path; dyslexia font; TTS for Explorer band |
| **Performance** | Low-bandwidth mode; PWA offline shell |
| **Moderation SLA** | Critical reports &lt;24h; UGC queue &lt;72h initial review |

---

## 10. Monetization & social impact

### 10.1 Revenue mix (ethical freemium)

| Stream | Description |
|--------|-------------|
| **Free core** | Core missions, basic parent dashboard, limited compete |
| **Family Plus** | Premium tracks, advanced analytics, multi-kid, exports |
| **Sponsored packs** | Brand-funded **vetted** mission collections (no dark patterns) |
| **Institutional** | Schools, NGOs, libraries — seat licenses |
| **Grants / donors** | Subsidized seats |

### 10.2 Social good (“1:1” model — configurable)

- Each **paid Family Plus** subscription funds **N free child seats** (default N=1).  
- Partner with nonprofits / schools for distribution.  
- Transparent counter on Impact page (no child PII).

---

## 11. Success metrics

| Phase | Metrics |
|-------|---------|
| MVP | Registration completion, D1/D7 retention, mission completion rate, parent dashboard opens |
| Community | UGC submissions/week, approval rate, time-to-publish |
| Monetization | Free→Plus conversion, churn, sponsored pack engagement |
| Impact | Scholarship seats activated, partner org count |

---

## 12. Delivery map (engineering)

| Phase | Theme | PRD themes |
|-------|--------|------------|
| 0–1 | Alpha hardening | C-1, P-2, safety baseline |
| 2 | Mastery engine | Learning loop in all subjects |
| 3 | Accounts | P-1, Google OAuth, COPPA |
| 4 | Social (safe) | C-3 compete, friends, duels — **no chat** |
| 5 | Parent/teacher | P-2, P-3, assignments, digests |
| 6 | Global | i18n, PWA, a11y |
| 7 | Life Explorer | Create, journals, stories |
| **8** | **Community & UGC** | R-1, A-1, missions table, moderation |
| **9** | **Monetization & impact** | Plus tier, scholarships, sponsors |
| **10** | **Teen mode & life skills** | Teen UI, expanded mission library |

---

## 13. Open questions

1. Verifiable parental consent provider (e.g. credit-card micro-charge vs email-plus)?  
2. Stripe vs Paddle for family subscriptions + COPPA considerations?  
3. Expert contributor verification (badge vs manual onboarding)?  
4. Geographic scope for launch (US-first COPPA vs GDPR-K)?

---

## 14. Related documents

| Doc | Purpose |
|-----|---------|
| [ROADMAP.md](./ROADMAP.md) | Phased engineering delivery |
| [MODERATION.md](./MODERATION.md) | UGC & child-safety moderation policy |
| [ALPHA_TODO.md](./ALPHA_TODO.md) | Current sprint checklist |
| [UX_REDESIGN_V1.md](./UX_REDESIGN_V1.md) | UI/layout rules |

---

*Designed by Vinay · Built with Cursor · Knowledge is free.*
