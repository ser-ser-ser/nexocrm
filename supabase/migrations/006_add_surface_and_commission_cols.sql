-- Migration: Add missing Surface and Commission columns to 'propiedades'
-- Description: Adds superficie_total, construido, terreno, and commission fields.

ALTER TABLE public.propiedades
ADD COLUMN IF NOT EXISTS superficie_total numeric NULL,
ADD COLUMN IF NOT EXISTS superficie_construida numeric NULL,
ADD COLUMN IF NOT EXISTS superficie_terreno numeric NULL,
ADD COLUMN IF NOT EXISTS comision_esquema text NULL,
ADD COLUMN IF NOT EXISTS comparte_comision boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS visible_red_brokers boolean DEFAULT false;

-- Comment on columns for clarity
COMMENT ON COLUMN public.propiedades.superficie_total IS 'Superficie total operativa/vendible';
COMMENT ON COLUMN public.propiedades.comision_esquema IS 'Descripción privada del esquema de comisiones';
