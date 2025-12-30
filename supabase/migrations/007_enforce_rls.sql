
-- 1. Helper Function to get current user's agency
-- This helps clean up policy syntax and improves performance by avoiding repeated subqueries
CREATE OR REPLACE FUNCTION public.get_my_agency_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id_agencia FROM public.perfiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. SECURING 'PERFILES' TABLE
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Ver propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Editar propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Ver equipo" ON public.perfiles;
DROP POLICY IF EXISTS "Independientes: Acceso total a sus datos" ON public.perfiles;
DROP POLICY IF EXISTS "Admin Agencia: Gestiona su equipo" ON public.perfiles;
DROP POLICY IF EXISTS "Agente: Ve equipo" ON public.perfiles;
DROP POLICY IF EXISTS "Agente: Edita su perfil" ON public.perfiles;

-- Policy A: Users see themselves
CREATE POLICY "Usuarios ven su propio perfil"
ON public.perfiles FOR SELECT
USING (auth.uid() = id);

-- Policy B: Users update themselves
CREATE POLICY "Usuarios editan su propio perfil"
ON public.perfiles FOR UPDATE
USING (auth.uid() = id);

-- Policy C: Agency Members see Colleagues (Admin & Agents)
-- Only if they belong to an agency (id_agencia is not null)
CREATE POLICY "Miembros de agencia ven a sus colegas"
ON public.perfiles FOR SELECT
USING (
  id_agencia IS NOT NULL 
  AND id_agencia = get_my_agency_id()
);

-- Policy D: Admins Update Agencies (Optional, strictly for admin_agencia)
CREATE POLICY "Admins editan su equipo"
ON public.perfiles FOR UPDATE
USING (
  (SELECT rol FROM public.perfiles WHERE id = auth.uid()) = 'admin_agencia'
  AND id_agencia = get_my_agency_id()
);


-- 3. SECURING 'PROPIEDADES' TABLE
ALTER TABLE public.propiedades ENABLE ROW LEVEL SECURITY;

-- Drop existing loose/old policies
DROP POLICY IF EXISTS "Ver propiedades propias" ON public.propiedades;
DROP POLICY IF EXISTS "Ver propiedades agencia" ON public.propiedades;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.propiedades;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.propiedades;

-- Policy E: View Properties (The Core Logic)
-- 1. Own properties (Everyone)
-- 2. Agency properties (Only if you are in an agency and it matches owner's agency)
CREATE POLICY "Ver propiedades (Propias y Agencia)"
ON public.propiedades FOR SELECT
USING (
  -- I own it
  propietario_id = auth.uid()
  OR
  -- It belongs to a colleague in my agency
  (
    get_my_agency_id() IS NOT NULL 
    AND 
    get_my_agency_id() = (SELECT id_agencia FROM public.perfiles WHERE id = propiedades.propietario_id)
  )
);

-- Policy F: Insert Properties
-- Anyone authenticated can insert, but must own it.
CREATE POLICY "Crear propiedades"
ON public.propiedades FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND propietario_id = auth.uid()
);

-- Policy G: Update Properties
-- 1. Own properties
-- 2. Agency Admins can update any property in their agency
CREATE POLICY "Editar propiedades"
ON public.propiedades FOR UPDATE
USING (
  propietario_id = auth.uid()
  OR
  (
    (SELECT rol FROM public.perfiles WHERE id = auth.uid()) = 'admin_agencia'
    AND
    get_my_agency_id() = (SELECT id_agencia FROM public.perfiles WHERE id = propiedades.propietario_id)
  )
);

-- Policy H: Delete Properties
-- Only Owner or Admin
CREATE POLICY "Eliminar propiedades"
ON public.propiedades FOR DELETE
USING (
  propietario_id = auth.uid()
  OR
  (
    (SELECT rol FROM public.perfiles WHERE id = auth.uid()) = 'admin_agencia'
    AND
    get_my_agency_id() = (SELECT id_agencia FROM public.perfiles WHERE id = propiedades.propietario_id)
  )
);
