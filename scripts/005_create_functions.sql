-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_tags_updated_at
  before update on public.tags
  for each row
  execute function public.update_updated_at_column();

create trigger update_notes_updated_at
  before update on public.notes
  for each row
  execute function public.update_updated_at_column();

-- Function to search notes by title and content
create or replace function public.search_notes(
  search_query text,
  user_uuid uuid
)
returns table (
  id uuid,
  title text,
  content text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  rank real
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    n.id,
    n.title,
    n.content,
    n.created_at,
    n.updated_at,
    ts_rank(
      to_tsvector('english', n.title || ' ' || n.content),
      plainto_tsquery('english', search_query)
    ) as rank
  from public.notes n
  where n.user_id = user_uuid
    and (
      to_tsvector('english', n.title || ' ' || n.content) @@ plainto_tsquery('english', search_query)
    )
  order by rank desc, n.updated_at desc;
end;
$$;
