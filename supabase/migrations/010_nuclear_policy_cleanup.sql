
BEGIN;

-- 1. DYNAMICALLY DROP ALL POLICIES (True Nuclear Option)
-- This iterates over system catalog to find ANY policy attached to our tables and drops them.
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE tablename IN ('perfiles', 'propiedades') 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename); 
    END LOOP; 
END $$;

-- 2. RE-APPLY STRICT POLICIES (The "Shield" - Same as 009 but now guaranteed clean)

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

COMMIT;
