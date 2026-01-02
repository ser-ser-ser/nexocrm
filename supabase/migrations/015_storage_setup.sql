-- Enable storage extensions if not enabled (usually enabled by default in Supabase)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('properties-images', 'properties-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('developments-docs', 'developments-docs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to avoid conflicts during testing/re-runs
DROP POLICY IF EXISTS "Public View Properties" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Properties" ON storage.objects;
DROP POLICY IF EXISTS "Public View Developments" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Developments" ON storage.objects;

-- 3. RLS Policies for 'properties-images'
CREATE POLICY "Public View Properties"
ON storage.objects FOR SELECT
USING ( bucket_id = 'properties-images' );

CREATE POLICY "Auth Upload Properties"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'properties-images'
    AND auth.role() = 'authenticated'
);

-- 4. RLS Policies for 'developments-docs'
CREATE POLICY "Public View Developments"
ON storage.objects FOR SELECT
USING ( bucket_id = 'developments-docs' );

CREATE POLICY "Auth Upload Developments"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'developments-docs'
    AND auth.role() = 'authenticated'
);
