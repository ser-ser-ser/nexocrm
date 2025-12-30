
-- 1. Correct the Trigger to point to 'perfiles' (Spanish)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, email, rol, creado_en)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'nombre_completo', 'Usuario Nuevo'),
    new.email,
    'agente', -- Default role
    NOW()
  );
  RETURN new;
END;
$$;

-- 2. Backfill missing profiles (Self-repair)
INSERT INTO public.perfiles (id, email, nombre_completo, rol, creado_en)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', email), 
    'agente'::rol_usuario,
    created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.perfiles);

-- 3. Update RLS Policies for 'perfiles'
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
DROP POLICY IF EXISTS "Ver propio perfil" ON public.perfiles;
CREATE POLICY "Ver propio perfil" ON public.perfiles FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Editar propio perfil" ON public.perfiles;
CREATE POLICY "Editar propio perfil" ON public.perfiles FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to view basic info of others (Collaborative CRM)
DROP POLICY IF EXISTS "Ver equipo" ON public.perfiles;
CREATE POLICY "Ver equipo" ON public.perfiles FOR SELECT TO authenticated USING (true);
