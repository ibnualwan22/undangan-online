-- Create note_tags junction table for many-to-many relationship
create table if not exists public.note_tags (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(note_id, tag_id) -- Prevent duplicate tag assignments
);

-- Enable RLS
alter table public.note_tags enable row level security;

-- Create policies for note_tags
create policy "note_tags_select_own"
  on public.note_tags for select
  using (auth.uid() = user_id);

create policy "note_tags_insert_own"
  on public.note_tags for insert
  with check (auth.uid() = user_id);

create policy "note_tags_delete_own"
  on public.note_tags for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists note_tags_note_id_idx on public.note_tags(note_id);
create index if not exists note_tags_tag_id_idx on public.note_tags(tag_id);
create index if not exists note_tags_user_id_idx on public.note_tags(user_id);
