-- ═══════════════════════════════════════════════════════════════════════════
-- Interior Designer Portfolio — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. portfolio ────────────────────────────────────────────────────────────
create table if not exists public.portfolio (
  id          uuid primary key default uuid_generate_v4(),
  title_en    text not null default '',
  title_ar    text not null default '',
  image_url   text not null,
  category    text not null default 'all'
                check (category in ('all','residential','commercial','hospitality')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── 2. site_settings ────────────────────────────────────────────────────────
create table if not exists public.site_settings (
  id                    integer primary key default 1,  -- singleton row
  hero_name_en          text not null default 'Nour Al-Rashidi',
  hero_name_ar          text not null default 'نور الرشيدي',
  hero_headline_en      text not null default 'Timeless Interior Design',
  hero_headline_ar      text not null default 'التصميم الداخلي الخالد',
  hero_description_en   text not null default 'Where luxury meets living.',
  hero_description_ar   text not null default 'حيث تلتقي الفخامة بالحياة.',
  about_bio1_en         text not null default '',
  about_bio1_ar         text not null default '',
  about_bio2_en         text not null default '',
  about_bio2_ar         text not null default '',
  whatsapp_number       text not null default '966501234567',
  show_whatsapp         boolean not null default true,
  updated_at            timestamptz not null default now()
);

-- Seed the singleton settings row (safe to run multiple times)
insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;

-- ─── 3. before_after ─────────────────────────────────────────────────────────
create table if not exists public.before_after (
  id          uuid primary key default uuid_generate_v4(),
  title_en    text not null default '',
  title_ar    text not null default '',
  before_url  text not null,
  after_url   text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── Row-Level Security ───────────────────────────────────────────────────────
alter table public.portfolio     enable row level security;
alter table public.site_settings enable row level security;
alter table public.before_after  enable row level security;

-- Public can read everything
create policy "public_read_portfolio"
  on public.portfolio for select using (true);

create policy "public_read_settings"
  on public.site_settings for select using (true);

create policy "public_read_before_after"
  on public.before_after for select using (true);

-- Only authenticated users (admin) can mutate
create policy "admin_all_portfolio"
  on public.portfolio for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_before_after"
  on public.before_after for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
-- Run this separately in the SQL editor:
insert into storage.buckets (id, name, public)
  values ('gallery', 'gallery', true)
  on conflict (id) do nothing;

-- Allow public reads on gallery bucket
create policy "public_read_gallery"
  on storage.objects for select
  using (bucket_id = 'gallery');

-- Allow authenticated uploads/deletes
create policy "admin_upload_gallery"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "admin_delete_gallery"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- ─── Helpful indexes ──────────────────────────────────────────────────────────
create index if not exists idx_portfolio_category   on public.portfolio(category);
create index if not exists idx_portfolio_sort       on public.portfolio(sort_order);
create index if not exists idx_before_after_sort    on public.before_after(sort_order);
