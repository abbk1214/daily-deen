-- Daily Deen: Supabase schema for data sync
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable RLS
alter database postgres set statement_timeout = '0';

-- User profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  city text,
  country text,
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prayer logs (synced from IndexedDB prayerLogs)
create table public.prayer_logs (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  prayer text not null,
  status text default 'pending',
  completed boolean default false,
  completed_at timestamptz,
  scheduled_time text default '',
  late boolean default false,
  missed boolean default false,
  jamaah boolean default false,
  qaza boolean default false,
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date, prayer)
);

-- Habit logs
create table public.habit_logs (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  habit_id bigint not null,
  date text not null,
  value real default 0,
  timestamp bigint,
  created_at timestamptz default now(),
  unique(user_id, habit_id, date)
);

-- Habits
create table public.habits (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  remote_id bigint,
  name text not null,
  type text default 'custom',
  target real default 1,
  unit text default '',
  increment real default 1,
  created_at timestamptz default now()
);

-- Journal entries
create table public.journal (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  content text default '',
  mood text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Mood entries
create table public.mood_entries (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  time text default '',
  mood text not null,
  notes text default '',
  created_at timestamptz default now()
);

-- Dhikr progress
create table public.dhikr_progress (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  dhikr_id text not null,
  target integer default 1,
  current integer default 0,
  date text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, dhikr_id, date)
);

-- Settings (one per user)
create table public.user_settings (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Water entries
create table public.water_entries (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  amount real default 0,
  timestamp bigint,
  created_at timestamptz default now()
);

-- Sleep entries
create table public.sleep_entries (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  duration real default 0,
  quality text default '',
  notes text default '',
  created_at timestamptz default now()
);

-- Exercise entries
create table public.exercise_entries (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  type text default 'other',
  duration real default 0,
  notes text default '',
  created_at timestamptz default now()
);

-- ─── Row Level Security ───

alter table public.profiles enable row level security;
alter table public.prayer_logs enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.journal enable row level security;
alter table public.mood_entries enable row level security;
alter table public.dhikr_progress enable row level security;
alter table public.user_settings enable row level security;
alter table public.water_entries enable row level security;
alter table public.sleep_entries enable row level security;
alter table public.exercise_entries enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own prayer_logs" on public.prayer_logs for select using (auth.uid() = user_id);
create policy "Users can insert own prayer_logs" on public.prayer_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own prayer_logs" on public.prayer_logs for update using (auth.uid() = user_id);
create policy "Users can delete own prayer_logs" on public.prayer_logs for delete using (auth.uid() = user_id);

create policy "Users can view own habits" on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on public.habits for delete using (auth.uid() = user_id);

create policy "Users can view own habit_logs" on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own habit_logs" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own habit_logs" on public.habit_logs for update using (auth.uid() = user_id);
create policy "Users can delete own habit_logs" on public.habit_logs for delete using (auth.uid() = user_id);

create policy "Users can view own journal" on public.journal for select using (auth.uid() = user_id);
create policy "Users can insert own journal" on public.journal for insert with check (auth.uid() = user_id);
create policy "Users can update own journal" on public.journal for update using (auth.uid() = user_id);
create policy "Users can delete own journal" on public.journal for delete using (auth.uid() = user_id);

create policy "Users can view own mood_entries" on public.mood_entries for select using (auth.uid() = user_id);
create policy "Users can insert own mood_entries" on public.mood_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own mood_entries" on public.mood_entries for delete using (auth.uid() = user_id);

create policy "Users can view own dhikr_progress" on public.dhikr_progress for select using (auth.uid() = user_id);
create policy "Users can insert own dhikr_progress" on public.dhikr_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own dhikr_progress" on public.dhikr_progress for update using (auth.uid() = user_id);
create policy "Users can delete own dhikr_progress" on public.dhikr_progress for delete using (auth.uid() = user_id);

create policy "Users can view own user_settings" on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own user_settings" on public.user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own user_settings" on public.user_settings for update using (auth.uid() = user_id);

create policy "Users can view own water_entries" on public.water_entries for select using (auth.uid() = user_id);
create policy "Users can insert own water_entries" on public.water_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own water_entries" on public.water_entries for delete using (auth.uid() = user_id);

create policy "Users can view own sleep_entries" on public.sleep_entries for select using (auth.uid() = user_id);
create policy "Users can insert own sleep_entries" on public.sleep_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own sleep_entries" on public.sleep_entries for delete using (auth.uid() = user_id);

create policy "Users can view own exercise_entries" on public.exercise_entries for select using (auth.uid() = user_id);
create policy "Users can insert own exercise_entries" on public.exercise_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own exercise_entries" on public.exercise_entries for delete using (auth.uid() = user_id);

-- ─── Auto-create profile on signup ───

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Indexes for common queries ───

create index idx_prayer_logs_user_date on public.prayer_logs(user_id, date);
create index idx_habit_logs_user_date on public.habit_logs(user_id, date);
create index idx_journal_user_date on public.journal(user_id, date);
create index idx_mood_entries_user_date on public.mood_entries(user_id, date);
create index idx_dhikr_progress_user_date on public.dhikr_progress(user_id, date);
