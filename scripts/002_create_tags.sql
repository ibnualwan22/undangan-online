-- Create tags table
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#3b82f6', -- Default blue color
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, user_id) -- Prevent duplicate tag names per user
);

-- Enable RLS
alter table public.tags enable row level security;

-- Create policies for tags
create policy "tags_select_own"
  on public.tags for select
  using (auth.uid() = user_id);

create policy "tags_insert_own"
  on public.tags for insert
  with check (auth.uid() = user_id);

create policy "tags_update_own"
  on public.tags for update
  using (auth.uid() = user_id);

create policy "tags_delete_own"
  on public.tags for delete
  using (auth.uid() = user_id);

-- Create index for better performance
create index if not exists tags_user_id_idx on public.tags(user_id);
create index if not exists tags_name_idx on public.tags(name);
