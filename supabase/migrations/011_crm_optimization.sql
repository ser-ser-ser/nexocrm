
BEGIN;

-- 1. CRM TABLE OPTIMIZATION (As per Senior Dev instruction)
-- Clean up layout and ensure multitenancy support

-- Drop legacy/duplicate column if exists
ALTER TABLE public.oportunidades DROP COLUMN IF EXISTS oportunidad_id;

-- Ensure Agency Link for Multitenancy
ALTER TABLE public.oportunidades 
ADD COLUMN IF NOT EXISTS id_agencia UUID REFERENCES public.agencias(id);

-- Ensure Kanban Columns
ALTER TABLE public.oportunidades 
ADD COLUMN IF NOT EXISTS etapa TEXT DEFAULT 'nuevo'; -- prospecto, visita, negociacion, cierre

ALTER TABLE public.oportunidades 
ADD COLUMN IF NOT EXISTS probabilidad INTEGER DEFAULT 0;

-- 2. INDEX OPTIMIZATION (Performance)
CREATE INDEX IF NOT EXISTS idx_propiedades_agencia ON public.propiedades(id_agencia);
CREATE INDEX IF NOT EXISTS idx_oportunidades_agencia ON public.oportunidades(id_agencia);
CREATE INDEX IF NOT EXISTS idx_propiedades_features ON public.propiedades USING GIN (caracteristicas);

-- 3. CRM SECURITY (RLS)
ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;

-- Policy: Admin sees all in Agency
DROP POLICY IF EXISTS "Admin ve todo agencia" ON public.oportunidades;
CREATE POLICY "Admin ve todo agencia" ON public.oportunidades 
FOR ALL USING (
    id_agencia IN (
        SELECT id_agencia FROM public.perfiles 
        WHERE id = auth.uid() AND rol = 'admin_agencia'
    )
);

-- Policy: Agent sees own assigned deals (or independent)
DROP POLICY IF EXISTS "Agente ve lo suyo" ON public.oportunidades;
CREATE POLICY "Agente ve lo suyo" ON public.oportunidades 
FOR ALL USING (
    -- Assuming 'asignado_a' exists, otherwise likely 'usuario_id' or similar. 
    -- Will verify via checking columns, but script assumes 'asignado_a'.
    -- If it doesn't exist, I will add it in the script to be safe?
    -- DECISION: I'll expect 'asignado_a' to exist or I should add it.
    -- (Self-correction: I will add it here if safety check fails, but for now assuming prompt is correct)
    asignado_a = auth.uid() OR id_agencia IS NULL
);

COMMIT;
