-- AI Fashion Shopping — schema inicial
-- Rode este arquivo no SQL editor do Supabase (ou via `supabase db push`).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- products: catálogo (nunca inventado pela IA)
-- ─────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'DEMO_PRODUCT',
  name text not null,
  category text not null,
  subcategory text,
  brand text not null,
  price numeric(10, 2) not null check (price >= 0),
  previous_price numeric(10, 2),
  currency text not null default 'BRL',
  image text not null,
  url text not null,
  store text not null,
  description text,
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  material text,
  style text[] not null default '{}',
  gender text check (gender in ('male', 'female', 'unisex')),
  rating numeric(2, 1) check (rating between 0 and 5),
  review_count int check (review_count >= 0),
  availability boolean not null default true,
  tags text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_gender_idx on products (gender);
create index if not exists products_price_idx on products (price);
create index if not exists products_style_idx on products using gin (style);
create index if not exists products_tags_idx on products using gin (tags);

-- ─────────────────────────────────────────────
-- searches: cada pedido de busca por intenção
-- ─────────────────────────────────────────────
create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  raw_query text not null,
  parsed_intent jsonb not null,
  user_id uuid,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- looks: looks montados a partir de uma busca
-- ─────────────────────────────────────────────
create table if not exists looks (
  id uuid primary key default gen_random_uuid(),
  search_id uuid references searches (id) on delete cascade,
  label text not null check (label in ('best_match', 'best_value', 'most_stylish')),
  title text not null,
  reasoning text not null,
  product_ids uuid[] not null,
  total_price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists looks_search_id_idx on looks (search_id);

-- ─────────────────────────────────────────────
-- favorites (preparado para fase 4)
-- ─────────────────────────────────────────────
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  product_id uuid not null references products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ─────────────────────────────────────────────
-- events: analytics (MVP simples, migrar depois se necessário)
-- ─────────────────────────────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  payload jsonb,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists events_name_idx on events (name);
create index if not exists events_created_at_idx on events (created_at);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table products enable row level security;
alter table searches enable row level security;
alter table looks enable row level security;
alter table favorites enable row level security;
alter table events enable row level security;

-- catálogo é público para leitura (anon key), sem escrita pelo cliente
create policy "products_public_read" on products
  for select using (true);

-- searches, looks e events: sem acesso via anon key.
-- Toda leitura/escrita passa pelo backend com a service role key,
-- que ignora RLS por padrão — nenhuma policy adicional é necessária aqui.

-- favorites: dono só enxerga/gerencia os próprios registros (fase 4, com auth)
create policy "favorites_owner_select" on favorites
  for select using (auth.uid() = user_id);

create policy "favorites_owner_insert" on favorites
  for insert with check (auth.uid() = user_id);

create policy "favorites_owner_delete" on favorites
  for delete using (auth.uid() = user_id);
