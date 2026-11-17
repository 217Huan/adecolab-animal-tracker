-- Run once in your Supabase project's SQL Editor before enabling accounts.
create table public.vocabulary_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null check (word_id ~ '^[1-8]-[1-9][0-9]*$'),
  created_at timestamptz not null default now(),
  primary key (user_id, word_id)
);
alter table public.vocabulary_favorites enable row level security;
revoke all on public.vocabulary_favorites from anon;
revoke all on public.vocabulary_favorites from authenticated;
grant select, insert, delete on public.vocabulary_favorites to authenticated;
create policy "Read own favorites" on public.vocabulary_favorites for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Add own favorites" on public.vocabulary_favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Remove own favorites" on public.vocabulary_favorites for delete to authenticated
  using ((select auth.uid()) = user_id);
