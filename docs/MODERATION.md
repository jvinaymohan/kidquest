# KidQuest — Moderation & child-safety policy (product)

**Applies to:** all user-generated content (UGC), community submissions, and social features.  
**Principle:** Safety is a **pillar**, not a feature. When in doubt, **do not publish**.

---

## 1. What counts as UGC

| Source | Examples | Visible to kids before review? |
|--------|----------|--------------------------------|
| Contributor (parent/teacher/expert) | Mission ideas, activity prompts | **Never** |
| Child | Idea templates (structured fields only) | **Never** (becomes internal signal only) |
| System/curated | Staff-written missions | Yes (after internal QA) |

---

## 2. Default social rules (minors)

- **No** open kid-to-kid chat.  
- **No** public profiles or follower counts for children.  
- **No** location sharing or meet-up facilitation.  
- **No** direct messaging between minors.  
- **Friends** = parent-aware invite codes; **compete** = async challenges (Daily Duel, leaderboards).  
- **Emotes only** if reactions are added later — no free-text between kids.

---

## 3. Submission pipeline

```
Submit → Automated checks → Moderator queue → (Optional) Expert review → Publish → Monitor
```

### 3.1 Automated checks (pre-queue)

- Profanity / slur lists (multi-language roadmap).  
- PII patterns (email, phone, address, social handles).  
- External links (strip or block by default).  
- Age/tag required fields (reject incomplete).  
- Rate limits per account.

### 3.2 Human review (required before publish)

Moderators verify:

- Age-appropriate language and topics.  
- No violence, self-harm, hate, sexual content, dangerous challenges.  
- No commercial manipulation targeted at children.  
- Clear learning objective + reflection step.  
- Offline activities assume **parent supervision** where needed.

### 3.3 Expert review (optional)

Flag for educator/child-development review when:

- Health, safety, money, or civic topics.  
- Sensitive cultural/religious content.  
- Teen-only topics.

---

## 4. Reporting & enforcement

| Action | Who | SLA (target) |
|--------|-----|----------------|
| Report content | Parent, teacher, mod | Acknowledge immediate |
| Critical (CSAM, threats) | Anyone | **&lt;1h** — escalate legal process |
| Standard UGC issue | Parent/mod | **&lt;24h** |
| Queue backlog | Mod team | **&lt;72h** first review |

**Enforcement ladder:** warn → suspend submit → suspend account → ban + preserve audit log.

---

## 5. COPPA-aligned data practices (summary)

- Under **13:** parental consent before collecting personal information beyond what is strictly necessary.  
- **Minimize** data: display name, age band, progress — not full name, school, or photo by default.  
- Parents may **review, export, delete** child-linked data (see Settings export; full API in Phase 3).  
- **No** behavioral advertising to children.  
- **No** selling personal data.

Product implementation tracker: [PRD.md §4](./PRD.md#4-age-bands--interaction-levels).

---

## 6. Content types & kid visibility

| Type | Kid can create? | Kid can see others’? |
|------|-----------------|----------------------|
| Mission (published) | No | Yes (approved only) |
| Idea submission | Yes (template) | No |
| Life Explorer journal | Yes | Private default |
| Story | Yes | Private / link / class (parent-gated) |
| Leaderboard row | Auto | Display name + score only |
| Friend link | Via parent flow | Name + async stats only |

---

## 7. Sponsored & partner content

- All sponsored mission packs **same moderation bar** as community content.  
- Clear “Sponsored” label for parents.  
- No loot-box monetization or pressure tactics (see App Store 1.2 safety alignment).

---

## 8. Engineering hooks (planned)

| Component | Purpose |
|-----------|---------|
| `ugc_submissions` table | Queue state: pending, approved, rejected |
| Admin `/admin/moderation` | Review UI (Phase 8) |
| `report_abuse` table | User reports |
| Audit log | Who approved what, when |

---

## 9. Review checklist (moderator)

- [ ] Age band and interaction tier set correctly  
- [ ] No PII or contact exchange  
- [ ] No dangerous physical challenge without supervision note  
- [ ] Includes reflection or parent discussion prompt  
- [ ] Language kind and encouraging (aligns with coaching copy audit)  
- [ ] Sponsor disclosure if applicable  

---

*Policy version 1.0 — update when launching public UGC submit.*
