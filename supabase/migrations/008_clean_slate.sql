
BEGIN;

-- 1. CLEANUP (Nuclear Option requested by user)
-- This wipes all business data but keeps the Auth Users (accounts) intact.
TRUNCATE TABLE public.propiedades CASCADE;
TRUNCATE TABLE public.perfiles CASCADE;
TRUNCATE TABLE public.agencias CASCADE;

-- 2. RESTORE AGENCY "GRUPO MASTER"
INSERT INTO public.agencias (id, nombre, logo_url)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grupo Master Inmobiliario', 'https://api.dicebear.com/7.x/initials/svg?seed=GM');

-- 3. RE-HYDRATE PROFILES FROM AUTH.USERS
-- This ensures 100% match between Login UUID and Profile UUID
INSERT INTO public.perfiles (id, email, nombre_completo, rol, id_agencia)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Usuario Sin Nombre'),
    'agente', -- Default role
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' -- Default to Grupo Master
FROM auth.users;

-- 4. FIX SPECIFIC ROLES (As agreed)

-- SERAPIO -> Admin Agencia
UPDATE public.perfiles 
SET rol = 'admin_agencia' 
WHERE email = 'serapiosaurio@gmail.com';

-- JUAN -> Independiente (No Agency)
UPDATE public.perfiles 
SET rol = 'independiente', id_agencia = NULL
WHERE email = 'juan@independiente.com';

-- PERSY, PEDRO, LAURA -> Stay as 'agente' in Grupo Master (Default applied above)

-- 5. RE-INSERT TEST INVENTORY (To avoid empty dashboard)
-- Industrial Property for Pedro
INSERT INTO public.propiedades (
    titulo, 
    descripcion, 
    tipo, 
    operacion, 
    precio, 
    moneda, 
    ubicacion, 
    propietario_id,
    caracteristicas
) VALUES (
    'Nave Industrial Norte', 
    'Nave de alto nivel con andenes.', 
    'industrial', 
    'renta', 
    150000, 
    'MXN', 
    NULL,
    (SELECT id FROM public.perfiles WHERE email = 'pedro@grupomaster.com' LIMIT 1),
    '{"andenes": 4, "altura_libre": 12, "construccion": 2000}'::jsonb
);

-- House for Juan (Independent)
INSERT INTO public.propiedades (
    titulo, 
    descripcion, 
    tipo, 
    operacion, 
    precio, 
    moneda, 
    ubicacion, 
    propietario_id,
    caracteristicas
) VALUES (
    'Casa en Las Lomas', 
    'Residencia de lujo independiente.', 
    'residencial', 
    'venta', 
    8500000, 
    'MXN', 
    '{"direccion": "Las Lomas, CDMX"}',
    (SELECT id FROM public.perfiles WHERE email = 'juan@independiente.com' LIMIT 1),
    '{"banos": 3, "recamaras": 4, "estacionamientos": 2}'::jsonb
);

COMMIT;
