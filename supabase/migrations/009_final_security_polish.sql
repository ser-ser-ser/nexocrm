
BEGIN;

-- 1. PURGE ALL EXISTING POLICIES (Nuclear option for Policies)
-- We need to ensure NO legacy policy remains that might allow 'public' access.
-- It's tedious to list them all by name because they vary, but we can try dropping likely culprits.

DROP POLICY IF EXISTS "Propiedades visibles para todos" ON public.propiedades;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.propiedades;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.propiedades;
DROP POLICY IF EXISTS "Agentes editan sus propiedades" ON public.propiedades;
DROP POLICY IF EXISTS "Ver propiedades (Propias y Agencia)" ON public.propiedades;
DROP POLICY IF EXISTS "Crear propiedades" ON public.propiedades;
DROP POLICY IF EXISTS "Editar propiedades" ON public.propiedades;
DROP POLICY IF EXISTS "Eliminar propiedades" ON public.propiedades;

DROP POLICY IF EXISTS "Ver propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Editar propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Ver equipo" ON public.perfiles;
DROP POLICY IF EXISTS "Miembros de agencia ven a sus colegas" ON public.perfiles;
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Usuarios editan su propio perfil" ON public.perfiles;

-- 2. RE-APPLY STRICT POLICIES (The "Shield")

-- Helper Function (Ensure it exists and is correct)
CREATE OR REPLACE FUNCTION public.get_my_agency_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE
AS $$ SELECT id_agencia FROM public.perfiles WHERE id = auth.uid() LIMIT 1; $$;

-- Policies for PROPIEDADES
CREATE POLICY "Strict: Ver (Propias y Agencia)"
ON public.propiedades FOR SELECT
USING (
  propietario_id = auth.uid() OR
  (get_my_agency_id() IS NOT NULL AND get_my_agency_id() = (SELECT id_agencia FROM public.perfiles WHERE id = propiedades.propietario_id))
);

CREATE POLICY "Strict: Creating (Propias)"
ON public.propiedades FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND propietario_id = auth.uid());

CREATE POLICY "Strict: Editar (Propias y Admin)"
ON public.propiedades FOR UPDATE
USING (
  propietario_id = auth.uid() OR
  ((SELECT rol FROM public.perfiles WHERE id = auth.uid()) = 'admin_agencia' AND get_my_agency_id() = (SELECT id_agencia FROM public.perfiles WHERE id = propiedades.propietario_id))
);

CREATE POLICY "Strict: Eliminar (Propias y Admin)"
ON public.propiedades FOR DELETE
USING (
  propietario_id = auth.uid() OR
  ((SELECT rol FROM public.perfiles WHERE id = auth.uid()) = 'admin_agencia' AND get_my_agency_id() = (SELECT id_agencia FROM public.perfiles WHERE id = propiedades.propietario_id))
);

-- Policies for PERFILES
CREATE POLICY "Strict: Ver Perfil (Propios y Agencia)"
ON public.perfiles FOR SELECT
USING (
  id = auth.uid() OR
  (id_agencia IS NOT NULL AND id_agencia = get_my_agency_id())
);

CREATE POLICY "Strict: Editar Perfil (Propio)"
ON public.perfiles FOR UPDATE
USING (id = auth.uid());

-- 3. HARDEN NEW USER TRIGGER (Manual Reset Support)
-- Ensures that if user registers manually, they get created properly.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, email, rol, creado_en)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo'),
    new.email,
    'agente', -- Secure Default
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Idempotency
  RETURN new;
END;
$$;

COMMIT;
