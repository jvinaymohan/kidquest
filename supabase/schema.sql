-- KidQuest Supabase schema
-- Apply automatically: npm run db:apply  (from kidquest/)
-- Idempotent where possible so re-runs do not destroy data.

create extension if not exists pgcrypto;

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  kid_name text,
  display_name text,
  age_group text not null default 'adventurer' check (age_group in ('explorer','adventurer','champion')),
  role text not null default 'kid' check (role in ('kid','parent','teacher','contributor','admin')),
  email text,
  avatar_config jsonb not null default '{"skin":1,"hair":1,"outfit":1,"accessory":0}'::jsonb,
  parent_pin text not null default '1234',
  classroom_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 2. USER STATS (xp, level, streak, daily counters)
-- ============================================================
create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp integer not null default 0,
  total_points integer not null default 0,
  level integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_play_date date,
  lessons_today_date date,
  lessons_today_count integer not null default 0,
  badges jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_stats_touch on public.user_stats;
create trigger trg_user_stats_touch before update on public.user_stats
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 3. LESSON PROGRESS (geography, solar-system, etc.)
-- ============================================================
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  subject_id text not null,
  stars integer not null default 0,
  mastered boolean not null default false,
  attempts integer not null default 0,
  last_score integer not null default 0,
  last_total integer not null default 0,
  last_played date,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_lesson_progress_subject on public.lesson_progress(subject_id);

drop trigger if exists trg_lesson_progress_touch on public.lesson_progress;
create trigger trg_lesson_progress_touch before update on public.lesson_progress
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 4. MULTIPLICATION TABLE PROGRESS
-- ============================================================
create table if not exists public.mul_table_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  table_number integer not null check (table_number between 1 and 20),
  unlocked boolean not null default false,
  current_phase integer not null default 1 check (current_phase between 1 and 5),
  learn_complete boolean not null default false,
  boss_passed boolean not null default false,
  boss_best integer not null default 0,
  sr_passes integer not null default 0,
  legend_at timestamptz,
  best_drill_avg_ms integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, table_number)
);

create index if not exists idx_mul_table_user on public.mul_table_progress(user_id);

drop trigger if exists trg_mul_table_touch on public.mul_table_progress;
create trigger trg_mul_table_touch before update on public.mul_table_progress
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 5. MULTIPLICATION FACT PROGRESS (SRS)
-- ============================================================
create table if not exists public.mul_fact_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  fact_id text not null,
  practice_hits integer not null default 0,
  drill_fast_hits integer not null default 0,
  ease_factor numeric(4,2) not null default 2.5,
  interval_days integer not null default 1,
  repetitions integer not null default 0,
  next_review_date date,
  attempt_count integer not null default 0,
  correct_count integer not null default 0,
  avg_response_ms integer not null default 0,
  fastest_response_ms integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, fact_id)
);

create index if not exists idx_mul_fact_user on public.mul_fact_progress(user_id);
create index if not exists idx_mul_fact_due on public.mul_fact_progress(user_id, next_review_date);

drop trigger if exists trg_mul_fact_touch on public.mul_fact_progress;
create trigger trg_mul_fact_touch before update on public.mul_fact_progress
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 6. CLASSROOMS + MEMBERSHIPS
-- ============================================================
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  grade_band text,
  created_at timestamptz not null default now()
);

create table if not exists public.classroom_members (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'kid' check (member_role in ('kid','teacher','parent')),
  joined_at timestamptz not null default now(),
  primary key (classroom_id, user_id)
);

create index if not exists idx_classroom_owner on public.classrooms(owner_id);
create index if not exists idx_classroom_members_user on public.classroom_members(user_id);

-- ============================================================
-- 7. ASSIGNMENTS
-- ============================================================
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid references public.classrooms(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject_id text not null default 'math',
  due_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_assignments_classroom on public.assignments(classroom_id);
create index if not exists idx_assignments_owner on public.assignments(owner_id);

create table if not exists public.assignment_completions (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  done boolean not null default false,
  done_at timestamptz,
  primary key (assignment_id, user_id)
);

-- ============================================================
-- 8. PARENT DIGEST LOG
-- ============================================================
create table if not exists public.parent_digests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references auth.users(id) on delete set null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_parent_digests_user on public.parent_digests(user_id);

-- ============================================================
-- 9. SPEED RUN RESULTS + LEADERBOARD (link to user)
-- ============================================================
create table if not exists public.speed_run_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  kid_name text not null,
  age_group text not null,
  classroom text not null default 'A',
  score integer not null check (score between 0 and 50),
  total_time_ms integer not null check (total_time_ms > 0),
  accuracy_pct numeric(5,2) not null check (accuracy_pct >= 0 and accuracy_pct <= 100),
  created_at timestamptz not null default now()
);

-- Upgrade projects that created speed_run_results before user_id was added
alter table public.speed_run_results
  add column if not exists user_id uuid references auth.users(id) on delete set null;

drop view if exists public.speed_run_leaderboard;

create index if not exists idx_speed_run_results_user on public.speed_run_results(user_id);
create index if not exists idx_speed_run_results_age_group on public.speed_run_results(age_group);
create index if not exists idx_speed_run_results_score_time on public.speed_run_results(score desc, total_time_ms asc);

create or replace view public.speed_run_leaderboard as
with ranked as (
  select
    user_id,
    kid_name,
    age_group,
    classroom,
    score,
    total_time_ms,
    created_at as best_at,
    row_number() over (
      partition by coalesce(user_id::text, kid_name), age_group, classroom
      order by score desc, total_time_ms asc, created_at asc
    ) as rn
  from public.speed_run_results
)
select user_id, kid_name, age_group, classroom, score, total_time_ms, best_at
from ranked
where rn = 1;

-- ============================================================
-- 10. AUTO-CREATE profile + stats on new auth.user
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_invite_code text;
  v_invite record;
begin
  v_invite_code := nullif(trim(coalesce(new.raw_user_meta_data ->> 'invite_code', '')), '');

  if v_invite_code is null then
    raise exception 'Invite code required to register.';
  end if;

  select *
  into v_invite
  from public.invite_codes
  where code = v_invite_code
  order by created_at desc
  limit 1
  for update;

  if v_invite.id is null then
    raise exception 'Invite code is invalid.';
  end if;

  if v_invite.status <> 'active' then
    raise exception 'Invite code is not active.';
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at <= now() then
    raise exception 'Invite code has expired.';
  end if;

  if v_invite.issued_to_email is not null and lower(v_invite.issued_to_email) <> lower(new.email) then
    raise exception 'Invite code is issued to a different email.';
  end if;

  update public.invite_codes
  set
    status = 'used',
    used_by_user_id = new.id,
    used_by_email = new.email,
    used_at = now()
  where id = v_invite.id;

  if v_invite.approved_request_id is not null then
    update public.referral_requests
    set
      status = 'approved',
      reviewed_at = coalesce(reviewed_at, now()),
      approved_invite_id = v_invite.id
    where id = v_invite.approved_request_id;
  end if;

  insert into public.profiles (id, display_name, kid_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)), coalesce(new.raw_user_meta_data ->> 'kid_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.user_stats (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 11–16. PHASES 2–7 EXTENSIONS
-- ============================================================

create table if not exists public.geography_country_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  country_code text not null,
  phase integer not null default 1 check (phase between 1 and 5),
  practice_hits integer not null default 0,
  sm2_interval integer not null default 1,
  sm2_easiness numeric not null default 2.5,
  next_review_date date,
  mastered boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, country_code)
);

create table if not exists public.solar_planet_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  planet_id text not null,
  phase integer not null default 1 check (phase between 1 and 5),
  facts_mastered integer not null default 0,
  next_review_date date,
  updated_at timestamptz not null default now(),
  primary key (user_id, planet_id)
);

create table if not exists public.life_explorer_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('map_pin', 'reading', 'movie', 'music', 'story')),
  title text not null,
  body text,
  meta jsonb not null default '{}'::jsonb,
  share_scope text not null default 'private' check (share_scope in ('private', 'link', 'class')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_life_explorer_user on public.life_explorer_items(user_id);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  kid_name text not null,
  age_group text not null default 'adventurer',
  avatar_config jsonb not null default '{"skin":1,"hair":1,"outfit":1,"accessory":0}'::jsonb,
  linked_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text not null default 'en',
  dyslexia_font boolean not null default false,
  low_bandwidth boolean not null default false,
  screen_time_limit_minutes integer,
  parent_consent_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.friend_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.friend_links (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_user_id),
  check (user_id <> friend_user_id)
);

create table if not exists public.daily_duels (
  id uuid primary key default gen_random_uuid(),
  duel_date date not null default current_date,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null default 0,
  total integer not null default 10,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (duel_date, user_id)
);

drop view if exists public.subject_mastery_leaderboard;
create or replace view public.subject_mastery_leaderboard as
select
  lp.user_id,
  coalesce(p.kid_name, p.display_name, 'Hero') as kid_name,
  p.age_group,
  lp.subject_id,
  count(*) filter (where lp.mastered) as mastered_count,
  count(*) as lesson_count,
  coalesce(round(100.0 * count(*) filter (where lp.mastered) / nullif(count(*), 0))::int, 0) as mastery_pct
from public.lesson_progress lp
join public.profiles p on p.id = lp.user_id
group by lp.user_id, p.kid_name, p.display_name, p.age_group, lp.subject_id;

-- Leaderboard reads across users
drop policy if exists "lesson progress leaderboard read" on public.lesson_progress;
create policy "lesson progress leaderboard read" on public.lesson_progress
  for select to authenticated using (true);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.mul_table_progress enable row level security;
alter table public.mul_fact_progress enable row level security;
alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_completions enable row level security;
alter table public.parent_digests enable row level security;
alter table public.speed_run_results enable row level security;
alter table public.geography_country_progress enable row level security;
alter table public.solar_planet_progress enable row level security;
alter table public.life_explorer_items enable row level security;
alter table public.child_profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.friend_codes enable row level security;
alter table public.friend_links enable row level security;
alter table public.daily_duels enable row level security;

-- Profiles: user can see + edit only their own; everyone authenticated can see basic columns of others (for leaderboards) via dedicated view
drop policy if exists "self profile select" on public.profiles;
create policy "self profile select" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "self profile upsert" on public.profiles;
create policy "self profile upsert" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "self profile update" on public.profiles;
create policy "self profile update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- User stats: self only
drop policy if exists "self stats all" on public.user_stats;
create policy "self stats all" on public.user_stats
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lesson progress: self only
drop policy if exists "self lessons all" on public.lesson_progress;
create policy "self lessons all" on public.lesson_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mul table progress: self only
drop policy if exists "self mul table all" on public.mul_table_progress;
create policy "self mul table all" on public.mul_table_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mul fact progress: self only
drop policy if exists "self mul fact all" on public.mul_fact_progress;
create policy "self mul fact all" on public.mul_fact_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Classrooms: owner-managed; members can read
drop policy if exists "classroom owner all" on public.classrooms;
create policy "classroom owner all" on public.classrooms
  for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "classroom member read" on public.classrooms;
create policy "classroom member read" on public.classrooms
  for select to authenticated
  using (
    exists (
      select 1 from public.classroom_members m
      where m.classroom_id = classrooms.id and m.user_id = auth.uid()
    )
  );

-- Classroom members: self read, owner manage
drop policy if exists "member self read" on public.classroom_members;
create policy "member self read" on public.classroom_members
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "member self insert" on public.classroom_members;
create policy "member self insert" on public.classroom_members
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "member owner manage" on public.classroom_members;
create policy "member owner manage" on public.classroom_members
  for all to authenticated
  using (
    exists (
      select 1 from public.classrooms c
      where c.id = classroom_members.classroom_id and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.classrooms c
      where c.id = classroom_members.classroom_id and c.owner_id = auth.uid()
    )
  );

-- Assignments: classroom owner manages, members read
drop policy if exists "assignments owner all" on public.assignments;
create policy "assignments owner all" on public.assignments
  for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "assignments member read" on public.assignments;
create policy "assignments member read" on public.assignments
  for select to authenticated
  using (
    auth.uid() = owner_id
    or (
      classroom_id is not null
      and exists (
        select 1 from public.classroom_members m
        where m.classroom_id = assignments.classroom_id and m.user_id = auth.uid()
      )
    )
  );

-- Assignment completions: self only
drop policy if exists "assignment completions self all" on public.assignment_completions;
create policy "assignment completions self all" on public.assignment_completions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Parent digests: kid owns, but parent can also write if they know kid_id (use server-side later). Keep self-only for now.
drop policy if exists "parent digests self all" on public.parent_digests;
create policy "parent digests self all" on public.parent_digests
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Speed run results: authenticated users write own rows only; anon can read leaderboard view; authenticated can read aggregated leaderboard
drop policy if exists "allow public insert results" on public.speed_run_results;
drop policy if exists "allow public read results" on public.speed_run_results;

drop policy if exists "speed run self insert" on public.speed_run_results;
create policy "speed run self insert" on public.speed_run_results
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "speed run anon insert" on public.speed_run_results;
create policy "speed run anon insert" on public.speed_run_results
  for insert to anon with check (user_id is null);

drop policy if exists "speed run read all" on public.speed_run_results;
create policy "speed run read all" on public.speed_run_results
  for select to anon, authenticated using (true);

drop policy if exists "speed run self update" on public.speed_run_results;
create policy "speed run self update" on public.speed_run_results
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "speed run self delete" on public.speed_run_results;
create policy "speed run self delete" on public.speed_run_results
  for delete to authenticated using (auth.uid() = user_id);

-- Geography / solar progress: self only
drop policy if exists "geo progress self all" on public.geography_country_progress;
create policy "geo progress self all" on public.geography_country_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "solar progress self all" on public.solar_planet_progress;
create policy "solar progress self all" on public.solar_planet_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Life explorer: self only
drop policy if exists "life explorer self all" on public.life_explorer_items;
create policy "life explorer self all" on public.life_explorer_items
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Child profiles: parent owns
drop policy if exists "child profiles parent all" on public.child_profiles;
create policy "child profiles parent all" on public.child_profiles
  for all to authenticated using (auth.uid() = parent_user_id) with check (auth.uid() = parent_user_id);

-- User preferences: self
drop policy if exists "preferences self all" on public.user_preferences;
create policy "preferences self all" on public.user_preferences
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Friends: self manage links; read own code
drop policy if exists "friend codes self all" on public.friend_codes;
create policy "friend codes self all" on public.friend_codes
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "friend links self all" on public.friend_links;
create policy "friend links self all" on public.friend_links
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "friend links friend read" on public.friend_links;
create policy "friend links friend read" on public.friend_links
  for select to authenticated using (auth.uid() = friend_user_id);

-- Daily duels: self
drop policy if exists "daily duels self all" on public.daily_duels;
create policy "daily duels self all" on public.daily_duels
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- GRANTS
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.speed_run_leaderboard to anon, authenticated;
grant select on public.subject_mastery_leaderboard to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.user_stats to authenticated;
grant select, insert, update, delete on public.lesson_progress to authenticated;
grant select, insert, update, delete on public.mul_table_progress to authenticated;
grant select, insert, update, delete on public.mul_fact_progress to authenticated;
grant select, insert, update, delete on public.classrooms to authenticated;
grant select, insert, update, delete on public.classroom_members to authenticated;
grant select, insert, update, delete on public.assignments to authenticated;
grant select, insert, update, delete on public.assignment_completions to authenticated;
grant select, insert, update, delete on public.parent_digests to authenticated;
grant select, insert, update, delete on public.speed_run_results to authenticated;
grant select, insert on public.speed_run_results to anon;
grant select, insert, update, delete on public.geography_country_progress to authenticated;
grant select, insert, update, delete on public.solar_planet_progress to authenticated;
grant select, insert, update, delete on public.life_explorer_items to authenticated;
grant select, insert, update, delete on public.child_profiles to authenticated;
grant select, insert, update, delete on public.user_preferences to authenticated;
grant select, insert, update, delete on public.friend_codes to authenticated;
grant select, insert, update, delete on public.friend_links to authenticated;
grant select, insert, update, delete on public.daily_duels to authenticated;

-- ============================================================
-- ADMIN + APP FEEDBACK (alpha ops)
-- ============================================================
alter table public.profiles add column if not exists email text;

-- Relax role check to allow admin (idempotent)
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('kid','parent','teacher','contributor','admin'));

create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  contact_email text,
  contact_name text,
  user_role text,
  page_path text,
  category text not null default 'general'
    check (category in ('bug','feature','password','general','praise','other')),
  message text not null check (char_length(message) between 3 and 4000),
  rating smallint check (rating is null or (rating between 1 and 5)),
  status text not null default 'new'
    check (status in ('new','reviewing','resolved','wontfix')),
  admin_notes text,
  suggested_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  reason text not null check (char_length(trim(reason)) between 8 and 2000),
  referrer_name text,
  referrer_email text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_invite_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (char_length(trim(code)) between 8 and 64),
  status text not null default 'active'
    check (status in ('active','used','revoked','expired')),
  issued_to_email text,
  note text,
  approved_request_id uuid references public.referral_requests(id) on delete set null,
  issued_by uuid references auth.users(id) on delete set null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  used_by_user_id uuid references auth.users(id) on delete set null,
  used_by_email text,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'referral_requests_approved_invite_fkey'
  ) then
    alter table public.referral_requests
      add constraint referral_requests_approved_invite_fkey
      foreign key (approved_invite_id) references public.invite_codes(id) on delete set null;
  end if;
end;
$$;

create index if not exists idx_app_feedback_status on public.app_feedback(status, created_at desc);
create index if not exists idx_app_feedback_category on public.app_feedback(category, created_at desc);
create index if not exists idx_app_feedback_user on public.app_feedback(user_id);
create index if not exists idx_referrals_status on public.referral_requests(status, created_at desc);
create index if not exists idx_referrals_email on public.referral_requests(lower(email));
create index if not exists idx_invites_status on public.invite_codes(status, issued_at desc);
create index if not exists idx_invites_code on public.invite_codes(code);

drop trigger if exists trg_app_feedback_touch on public.app_feedback;
create trigger trg_app_feedback_touch before update on public.app_feedback
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_referral_requests_touch on public.referral_requests;
create trigger trg_referral_requests_touch before update on public.referral_requests
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_invite_codes_touch on public.invite_codes;
create trigger trg_invite_codes_touch before update on public.invite_codes
  for each row execute function public.touch_updated_at();

alter table public.app_feedback enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.validate_invite_code(p_code text, p_email text default null)
returns table (
  valid boolean,
  reason text,
  invite_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.invite_codes;
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
begin
  select *
  into v_invite
  from public.invite_codes
  where code = trim(coalesce(p_code, ''))
  order by created_at desc
  limit 1;

  if v_invite.id is null then
    return query select false, 'Invite code not found.', null::uuid;
    return;
  end if;

  if v_invite.status <> 'active' then
    return query select false, 'Invite code is no longer active.', v_invite.id;
    return;
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at <= now() then
    return query select false, 'Invite code has expired.', v_invite.id;
    return;
  end if;

  if v_invite.issued_to_email is not null and v_email is not null and lower(v_invite.issued_to_email) <> v_email then
    return query select false, 'Invite code was issued to a different email.', v_invite.id;
    return;
  end if;

  return query select true, 'ok', v_invite.id;
end;
$$;

revoke all on function public.validate_invite_code(text, text) from public;
grant execute on function public.validate_invite_code(text, text) to anon, authenticated;

create or replace function public.submit_referral_request(
  p_full_name text,
  p_email text,
  p_reason text,
  p_referrer_name text default null,
  p_referrer_email text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if char_length(trim(coalesce(p_full_name, ''))) < 2 then
    raise exception 'Name is required.';
  end if;
  if position('@' in trim(coalesce(p_email, ''))) < 2 then
    raise exception 'Valid email is required.';
  end if;
  if char_length(trim(coalesce(p_reason, ''))) < 8 then
    raise exception 'Please share a bit more about why you want access.';
  end if;

  insert into public.referral_requests (
    full_name, email, reason, referrer_name, referrer_email, status
  )
  values (
    trim(p_full_name),
    lower(trim(p_email)),
    trim(p_reason),
    nullif(trim(coalesce(p_referrer_name, '')), ''),
    nullif(lower(trim(coalesce(p_referrer_email, ''))), ''),
    'pending'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_referral_request(text, text, text, text, text) from public;
grant execute on function public.submit_referral_request(text, text, text, text, text) to anon, authenticated;

create or replace function public.submit_app_feedback(
  p_contact_email text default null,
  p_contact_name text default null,
  p_user_role text default null,
  p_page_path text default null,
  p_category text default 'general',
  p_message text default null,
  p_rating smallint default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_uid uuid := auth.uid();
  v_email text := nullif(lower(trim(coalesce(p_contact_email, ''))), '');
  v_message text := trim(coalesce(p_message, ''));
  v_category text := coalesce(nullif(trim(coalesce(p_category, '')), ''), 'general');
begin
  if char_length(v_message) < 3 then
    raise exception 'Please write a little more so we can help.';
  end if;
  if char_length(v_message) > 4000 then
    raise exception 'Message is too long.';
  end if;
  if v_category not in ('bug', 'feature', 'password', 'general', 'praise', 'other') then
    raise exception 'Invalid category.';
  end if;
  if p_rating is not null and (p_rating < 1 or p_rating > 5) then
    raise exception 'Invalid rating.';
  end if;
  if v_uid is null and v_email is null then
    raise exception 'Email is required when not signed in.';
  end if;
  if v_uid is null and position('@' in coalesce(v_email, '')) < 2 then
    raise exception 'Valid email is required.';
  end if;

  insert into public.app_feedback (
    user_id,
    contact_email,
    contact_name,
    user_role,
    page_path,
    category,
    message,
    rating,
    status
  )
  values (
    v_uid,
    v_email,
    nullif(trim(coalesce(p_contact_name, '')), ''),
    nullif(trim(coalesce(p_user_role, '')), ''),
    nullif(trim(coalesce(p_page_path, '')), ''),
    v_category,
    v_message,
    p_rating,
    'new'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_app_feedback(text, text, text, text, text, text, smallint) from public;
grant execute on function public.submit_app_feedback(text, text, text, text, text, text, smallint) to anon, authenticated;

-- Profiles: admins read all; users cannot self-promote to admin
drop policy if exists "admin profile select all" on public.profiles;
create policy "admin profile select all" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "self profile upsert" on public.profiles;
create policy "self profile upsert" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id and role in ('kid','parent','teacher','contributor'));

drop policy if exists "self profile update" on public.profiles;
create policy "self profile update" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role in ('kid','parent','teacher','contributor'));

-- Feedback: anyone authenticated can submit; admins manage
drop policy if exists "feedback insert auth" on public.app_feedback;
create policy "feedback insert auth" on public.app_feedback
  for insert to authenticated
  with check (
    user_id is null or user_id = auth.uid()
  );

drop policy if exists "feedback insert anon" on public.app_feedback;
create policy "feedback insert anon" on public.app_feedback
  for insert to anon
  with check (user_id is null and contact_email is not null);

drop policy if exists "feedback select self" on public.app_feedback;
create policy "feedback select self" on public.app_feedback
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "feedback admin all" on public.app_feedback;
create policy "feedback admin all" on public.app_feedback
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.referral_requests enable row level security;
alter table public.invite_codes enable row level security;

drop policy if exists "referrals submit anon" on public.referral_requests;
create policy "referrals submit anon" on public.referral_requests
  for insert to anon
  with check (
    status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and approved_invite_id is null
  );

drop policy if exists "referrals submit auth" on public.referral_requests;
create policy "referrals submit auth" on public.referral_requests
  for insert to authenticated
  with check (
    status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and approved_invite_id is null
  );

drop policy if exists "referrals admin all" on public.referral_requests;
create policy "referrals admin all" on public.referral_requests
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "invites admin all" on public.invite_codes;
create policy "invites admin all" on public.invite_codes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.app_feedback to authenticated;
grant insert on public.app_feedback to anon;
grant select, insert, update, delete on public.referral_requests to authenticated;
grant insert on public.referral_requests to anon;
grant select, insert, update, delete on public.invite_codes to authenticated;
