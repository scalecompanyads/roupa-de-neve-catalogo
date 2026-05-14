create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id text primary key,
  name text not null,
  tagline text,
  tone text not null default 'blue',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  name text not null,
  subtitle text,
  price text,
  clp_price text,
  colors text[] not null default '{}',
  active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  color text,
  is_cover boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "Public read categories" on public.categories for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read product images" on public.product_images for select using (true);

-- Para um painel simples com anon key, habilite temporariamente as policies abaixo.
-- Em produção, prefira proteger /admin com Supabase Auth e trocar estas policies por auth.role() = 'authenticated'.
create policy "Admin insert categories" on public.categories for insert with check (true);
create policy "Admin update categories" on public.categories for update using (true);
create policy "Admin insert products" on public.products for insert with check (true);
create policy "Admin update products" on public.products for update using (true);
create policy "Admin insert product images" on public.product_images for insert with check (true);
create policy "Admin update product images" on public.product_images for update using (true);
create policy "Admin delete product images" on public.product_images for delete using (true);

insert into storage.buckets (id, name, public)
values ('catalogo', 'catalogo', true)
on conflict (id) do nothing;
