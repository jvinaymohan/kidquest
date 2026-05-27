-- KidQuest Supabase schema for shared speed-run leaderboards
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.speed_run_results (
  id uuid primary key default gen_random_uuid(),
  kid_name text not null,
  age_group text not null,
  classroom text not null default 'A',
  score integer not null check (score between 0 and 50),
  total_time_ms integer not null check (total_time_ms > 0),
  accuracy_pct numeric(5,2) not null check (accuracy_pct >= 0 and accuracy_pct <= 100),
  created_at timestamptz not null default now()
);

create index if not exists idx_speed_run_results_age_group on public.speed_run_results(age_group);
create index if not exists idx_speed_run_results_classroom on public.speed_run_results(classroom);
create index if not exists idx_speed_run_results_score_time on public.speed_run_results(score desc, total_time_ms asc);

create or replace view public.speed_run_leaderboard as
with ranked as (
  select
    kid_name,
    age_group,
    classroom,
    score,
    total_time_ms,
    created_at as best_at,
    row_number() over (
      partition by kid_name, age_group, classroom
      order by score desc, total_time_ms asc, created_at asc
    ) as rn
  from public.speed_run_results
)
select kid_name, age_group, classroom, score, total_time_ms, best_at
from ranked
where rn = 1;

alter table public.speed_run_results enable row level security;

drop policy if exists "allow public insert results" on public.speed_run_results;
create policy "allow public insert results"
on public.speed_run_results
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow public read results" on public.speed_run_results;
create policy "allow public read results"
on public.speed_run_results
for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant select, insert on public.speed_run_results to anon, authenticated;
grant select on public.speed_run_leaderboard to anon, authenticated;
