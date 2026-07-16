-- =============================================
-- CodeMentor v2 — Supabase Schema
-- =============================================
-- Run this in the Supabase SQL Editor to set up tables and RLS policies.

-- Sessions table: tracks every coding session
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  language text not null,
  problem_description text,
  mode text not null check (mode in ('socratic', 'explain', 'review')),
  hint_count integer default 0,
  solved_independently boolean default false,
  concepts text[] default '{}',
  created_at timestamptz default now()
);

-- Concept graph table: tracks concept exposure per user
create table if not exists public.concept_graph (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  concept text not null,
  exposure_count integer default 1,
  connected_concepts text[] default '{}',
  updated_at timestamptz default now(),
  unique(user_id, concept)
);

-- =============================================
-- Row Level Security
-- =============================================

-- Enable RLS on sessions
alter table public.sessions enable row level security;

-- Users can read their own sessions
create policy "Users can view own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

-- Users can insert their own sessions
create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

-- Users can update their own sessions
create policy "Users can update own sessions"
  on public.sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable RLS on concept_graph
alter table public.concept_graph enable row level security;

-- Users can read their own concept graph
create policy "Users can view own concepts"
  on public.concept_graph for select
  using (auth.uid() = user_id);

-- Users can insert their own concepts
create policy "Users can insert own concepts"
  on public.concept_graph for insert
  with check (auth.uid() = user_id);

-- Users can update their own concepts
create policy "Users can update own concepts"
  on public.concept_graph for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- Indexes for performance
-- =============================================

create index idx_sessions_user_id on public.sessions(user_id);
create index idx_sessions_created_at on public.sessions(created_at);
create index idx_concept_graph_user_id on public.concept_graph(user_id);
create index idx_concept_graph_concept on public.concept_graph(concept);
