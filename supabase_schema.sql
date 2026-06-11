-- Run this in your Supabase SQL Editor to set up the database

create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  bedtime time not null,
  wake_time time not null,
  sleep_duration numeric(4,2),
  mood integer check (mood >= 1 and mood <= 5),
  tiredness integer check (tiredness >= 1 and tiredness <= 5),
  notes text,
  created_at timestamptz default now()
);

alter table public.sleep_logs enable row level security;

create policy "Users can read own logs"
  on public.sleep_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on public.sleep_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logs"
  on public.sleep_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own logs"
  on public.sleep_logs for delete
  using (auth.uid() = user_id);

create index if not exists sleep_logs_user_date
  on public.sleep_logs(user_id, date desc);
