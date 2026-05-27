# KidQuest UX Redesign v1

## Product UX North Star

- Kids should instantly feel: "This is a game-like adventure."
- Parents should instantly feel: "This is safe, structured, and effective."
- Every screen should answer one question clearly: what is my next best action?

## Navigation Architecture

- Kid bottom nav is fixed to 5 actions:
  - Learn
  - Explore
  - Create
  - Compete
  - Me
- Keep labels and order unchanged across all kid-mode routes.
- Parent settings remain in `Me` and `Settings` (PIN protected).

## UI Rules

- Touch targets: min 48px everywhere, 72px+ for keypad-heavy modes.
- Wrong-answer UX must be corrective and encouraging, never punitive.
- Progress should always be visible (bar, ring, dots, or phase text).
- Celebration should be specific (faster time, streak, milestone), not generic.
- Phase color language is global:
  - Learn = green
  - Practice = blue
  - Speed = amber
  - Boss = coral
  - Legend = near-black + gold

## Dashboard Hierarchy

1. Identity + streak continuity
2. Review due interruption card
3. Speed challenge card
4. Subject progress grid
5. Secondary discovery modules

## Parent UX

- Parent-facing areas are data-led and calm:
  - Daily activity
  - Subject/table progress
  - Controls (unlock, daily targets, audio)
  - Reports and exports
- Keep parent controls one tap away from profile/settings but always gated by PIN.
