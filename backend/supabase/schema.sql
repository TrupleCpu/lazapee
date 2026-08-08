-- Lazapee database schema (Supabase / PostgreSQL)
-- Run this in the Supabase SQL Editor before seeding.
--
-- NOTE: Row Level Security is intentionally left OFF for this assessment so the
-- backend (using the anon key) can read/write all tables, matching how a simple
-- demo deployment behaves.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  image text,
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  subtitle text,
  badge text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12, 2) not null default 0,
  quantity integer not null default 0,
  stock_type text not null default 'inStock',
  in_stock boolean not null default false,
  stock_status text not null default 'In Stock',
  image text,
  images jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address text,
  payment_type text not null default 'cod',
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  notes text,
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  sku text,
  image text,
  price numeric(12, 2) not null default 0,
  quantity integer not null default 1
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);