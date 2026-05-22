-- Book-O-Phile Supabase schema
-- Run in the Supabase SQL editor for your project.

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  genre text not null,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books (id) on delete cascade,
  reviewer_name text not null,
  review_text text not null,
  readability_score numeric(3, 1) not null check (readability_score >= 1 and readability_score <= 10),
  created_at timestamptz not null default now()
);

create index if not exists books_title_lower_idx on books (lower(trim(title)));
create index if not exists books_title_idx on books (title);
create index if not exists books_author_idx on books (author);
create index if not exists books_genre_idx on books (genre);
create index if not exists reviews_book_id_idx on reviews (book_id);

alter table books enable row level security;
alter table reviews enable row level security;

create policy "Allow public read on books"
  on books for select
  using (true);

create policy "Allow public insert on books"
  on books for insert
  with check (true);

create policy "Allow public read on reviews"
  on reviews for select
  using (true);

create policy "Allow public insert on reviews"
  on reviews for insert
  with check (true);
