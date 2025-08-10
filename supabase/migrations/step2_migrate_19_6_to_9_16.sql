-- Step 2: After running schema_gallery.sql and committing, run this to migrate old values
-- This must run in a separate transaction because new enum labels must be committed first

BEGIN;
UPDATE public.gallery_photos
SET aspect_ratio = '9_16'
WHERE aspect_ratio::text = '19_6';
COMMIT;
