-- 1. Fix RLS on 'agencias' table
ALTER TABLE public.agencias ENABLE ROW LEVEL SECURITY;

-- Allow public read access to agencies (needed for login/signup context)
CREATE POLICY "Agencias are viewable by everyone" 
ON public.agencias FOR SELECT 
USING (true);

-- Allow admins to insert/update (limiting to servicerole or specific admins for now to be safe, or just read-only for public)
-- For now, we'll assume only database admins/migrations create agencies, or we can add a policy for authenticated users if needed.
-- Keeping it read-only for public/anon is the critical part for RLS.

-- 2. Fix mutable search_path in handle_new_user
-- We need to replace the function with one that has 'SET search_path = public'
-- First, identifying the function signature. Usually trigger functions take no args.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;
