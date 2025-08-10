# Supabase: Gallery setup and usage

This guide creates the `gallery_photos` table, an `aspect_ratio` enum, RLS policies, and a public Storage bucket named `gallery`. It also shows how to upload images and insert rows used by your React app.

## Prerequisites
- Supabase project (URL and anon key already configured in your `.env` for Vite)
- Access to Supabase Dashboard

## 1) Apply the SQL
1. Open Supabase Dashboard → SQL Editor.
2. Paste the contents of `supabase/schema_gallery.sql` from this repo.
3. Click Run. You should see “Statement executed successfully”.

What this does:
- Creates enum `aspect_ratio` with values: `9_16`, `16_9`, `1_1`.
- Creates table `public.gallery_photos` with columns:
  - `id` (uuid, PK), `user_id` (uuid, FK to auth.users), `image_url` (text, http/https), `description` (text), `aspect_ratio` (enum), `created_at` (timestamp)
- Indexes on `created_at` and `aspect_ratio`
- Enables RLS with policies:
  - Public read of photos
  - Authenticated users can insert/update/delete their own rows
- Creates public Storage bucket `gallery` and policies for read/owner write
- Adds a convenience view `public.gallery_recent`

## 2) Upload images to Storage (Dashboard)
1. Storage → Create bucket named `gallery` (the script already does this; if it exists, skip).
2. Open the `gallery` bucket → Create Folder (optional) like `covers/` or `squares/`.
3. Upload your images.
4. For each image, copy the public URL from the file preview.

Tip: Public URL shape is usually:
`https://<your-project-ref>.supabase.co/storage/v1/object/public/gallery/<path/to/file>.jpg`

## 3) Insert database rows
Use the copied public URLs and insert rows either via:
- Table Editor → `public.gallery_photos` → Insert row, or
- SQL Editor, e.g.:

```
insert into public.gallery_photos (user_id, image_url, description, aspect_ratio)
values
  (auth.uid(), 'https://.../portrait-9x16.jpg', 'Portrait 9:16', '9_16'),
  (auth.uid(), 'https://.../cover-16x9.jpg', 'Cover 16:9', '16_9'),
  (auth.uid(), 'https://.../square-1x1.jpg', 'Square 1:1', '1_1');
```

If you’re running this in the SQL Editor and it complains about `auth.uid()`, replace with an actual user UUID or insert `null` for `user_id` if you don’t need ownership.

## 4) Using from the app
Your React code expects:
- Table name: `gallery_photos`
- Columns: `id, image_url, description, aspect_ratio, created_at`
- `aspect_ratio` values: `9_16`, `16_9`, `1_1`

Example query (already in your app):
```
const { data, error } = await supabase
  .from('gallery_photos')
  .select('id, image_url, description, aspect_ratio, created_at')
  .order('created_at', { ascending: false });
```

## 5) Optional: Admin upload from the site
If you want a simple admin uploader later:
- Use Supabase Auth (email magic link or OAuth) to sign in.
- Upload the file to Storage bucket `gallery`.
- Get the public URL and insert a row in `gallery_photos` with the chosen `aspect_ratio` and `description`.

## 6) Troubleshooting
- 404 image: Ensure the bucket is public and the file path is correct.
- No rows appear: Verify rows exist and `aspect_ratio` matches exactly `9_16`, `16_9`, or `1_1`.
- Insert denied: You must be authenticated; check RLS policies and `user_id` matches `auth.uid()`.
- Want fully public inserts? Create an additional policy for `role anon` on insert (not recommended).
