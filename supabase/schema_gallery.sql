-- Supabase Gallery Schema and Policies
-- Run this whole script in Supabase SQL Editor (Recommended)
-- Safe to run multiple times due to IF NOT EXISTS / ON CONFLICT guards

-- 1) Ensure required extension for UUID generation
create extension if not exists pgcrypto;

-- 2) Enum for aspect ratios used by the app
--    Values expected by the frontend: '9_16', '16_9', '1_1'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'aspect_ratio'
  ) THEN
    CREATE TYPE public.aspect_ratio AS ENUM ('9_16', '16_9', '1_1');
  END IF;
END
$$;

-- If enum already existed previously with '19_6', migrate it to '9_16'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'aspect_ratio' AND e.enumlabel = '19_6'
  ) THEN
    -- 1) Ensure '9_16' value exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'aspect_ratio' AND e.enumlabel = '9_16'
    ) THEN
      ALTER TYPE public.aspect_ratio ADD VALUE IF NOT EXISTS '9_16';
    END IF;

  -- 2) Migration of existing rows should be executed AFTER this block commits.
  --    Run the separate script in supabase/migrations/step2_migrate_19_6_to_9_16.sql

    -- 3) Recreate type without old label (requires type recreation via rename/cast if needed)
    -- Simpler approach: leave old label present but unused. Optional hard removal below:
    -- Note: Removing enum labels directly isn't supported; full recreation would be needed.
    -- For safety, we skip hard removal.
  END IF;
END$$;

-- 3) Main table for gallery photos
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  image_url text not null check (image_url ~* '^https?://'),
  description text,
  aspect_ratio public.aspect_ratio not null default '16_9',
  created_at timestamptz not null default now()
);

-- 4) Helpful indexes
create index if not exists gallery_photos_created_at_idx on public.gallery_photos (created_at desc);
create index if not exists gallery_photos_aspect_ratio_idx on public.gallery_photos (aspect_ratio);

-- 5) Enable Row Level Security and add policies
alter table public.gallery_photos enable row level security;

-- Allow anyone (anon + authenticated) to read gallery items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gallery_photos'
      AND policyname = 'gallery_public_read'
  ) THEN
    CREATE POLICY "gallery_public_read"
      ON public.gallery_photos FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Allow authenticated users to insert their own rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gallery_photos'
      AND policyname = 'gallery_authenticated_insert'
  ) THEN
    CREATE POLICY "gallery_authenticated_insert"
      ON public.gallery_photos FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Allow owners to update their own rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gallery_photos'
      AND policyname = 'gallery_owner_update'
  ) THEN
    CREATE POLICY "gallery_owner_update"
      ON public.gallery_photos FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Allow owners to delete their own rows (optional)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gallery_photos'
      AND policyname = 'gallery_owner_delete'
  ) THEN
    CREATE POLICY "gallery_owner_delete"
      ON public.gallery_photos FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- 6) Create a public storage bucket for images (if you prefer using Storage)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = excluded.public;

-- 7) Storage policies for the 'gallery' bucket
-- Public can READ images from this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'storage_gallery_public_read'
  ) THEN
    CREATE POLICY "storage_gallery_public_read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'gallery');
  END IF;
END
$$;

-- Authenticated users can UPLOAD into this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'storage_gallery_authenticated_insert'
  ) THEN
    CREATE POLICY "storage_gallery_authenticated_insert"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'gallery');
  END IF;
END
$$;

-- Owners can UPDATE their own objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'storage_gallery_owner_update'
  ) THEN
    CREATE POLICY "storage_gallery_owner_update"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'gallery' AND owner = auth.uid())
      WITH CHECK (bucket_id = 'gallery' AND owner = auth.uid());
  END IF;
END
$$;

-- Owners can DELETE their own objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'storage_gallery_owner_delete'
  ) THEN
    CREATE POLICY "storage_gallery_owner_delete"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'gallery' AND owner = auth.uid());
  END IF;
END
$$;

-- 8) Optional: sample inserts (replace URLs with your actual image URLs)
-- insert into public.gallery_photos (user_id, image_url, description, aspect_ratio)
-- values
--   (auth.uid(), 'https://YOUR-PUBLIC-IMAGE-URL/9x16-1.jpg', 'Sample 9:16 portrait', '9_16'),
--   (auth.uid(), 'https://YOUR-PUBLIC-IMAGE-URL/16x9-1.jpg', 'Sample 16:9 cover', '16_9'),
--   (auth.uid(), 'https://YOUR-PUBLIC-IMAGE-URL/1x1-1.jpg', 'Sample 1:1 square', '1_1');

-- 9) Simple view to check recent items
create or replace view public.gallery_recent as
select id, image_url, description, aspect_ratio, created_at
from public.gallery_photos
order by created_at desc
limit 50;
