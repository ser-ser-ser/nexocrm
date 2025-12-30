
DO $$
DECLARE
    new_agency_id uuid := gen_random_uuid();
    serapio_id uuid := '7f143ebd-1157-441a-906d-17af992f5724';
    juan_id uuid := '142f83d0-84fe-4524-b97b-7d8a689686d3';
    pedro_id uuid := 'd4d4a9c9-76a6-4680-8304-e0776f56b33f';
    laura_id uuid := 'ea4fb52c-7f85-4a65-ac51-c32bfc67df19';
    persi_id uuid := '877fb0a0-4d9a-4328-aa88-9562456cbe7f';
BEGIN
    -- 1. Create Layout Agency "Grupo Master" if not exists
    -- We try to find an existing agnecy or creating one.
    -- For testing, let's just create one.
    INSERT INTO public.agencias (id, nombre, logo_url)
    VALUES (new_agency_id, 'Grupo Master Inmobiliario', 'https://api.dicebear.com/7.x/initials/svg?seed=GM')
    ON CONFLICT DO NOTHING; -- In case we run multiple times, though ID is random. 
    -- Better practice: Check if exists or just use a fixed UUID for testing "Grupo Master"
    -- Let's use a fixed one for idempotency in this test script
    new_agency_id := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    
    INSERT INTO public.agencias (id, nombre, logo_url)
    VALUES (new_agency_id, 'Grupo Master Inmobiliario', 'https://api.dicebear.com/7.x/initials/svg?seed=GM')
    ON CONFLICT (id) DO UPDATE SET nombre = 'Grupo Master Inmobiliario';


    -- 2. Configure SERAPIO (Admin Agencia) -> Grupo Master
    UPDATE public.perfiles
    SET rol = 'admin_agencia', id_agencia = new_agency_id
    WHERE id = serapio_id;

    -- 3. Configure PEDRO (Agente) -> Grupo Master
    UPDATE public.perfiles
    SET rol = 'agente', id_agencia = new_agency_id
    WHERE id = pedro_id;
    
    -- 4. Configure LAURA (Agente) -> Grupo Master
    UPDATE public.perfiles
    SET rol = 'agente', id_agencia = new_agency_id
    WHERE id = laura_id;

    -- 5. Configure JUAN (Independiente) -> No Agency
    UPDATE public.perfiles
    SET rol = 'independiente', id_agencia = NULL
    WHERE id = juan_id;

    -- 6. Configure PERSI (New Agent) -> Grupo Master (for now, or NULL)
    -- Let's put Persi in Grupo Master too to test "seeing colleagues"
    UPDATE public.perfiles
    SET rol = 'agente', id_agencia = new_agency_id
    WHERE id = persi_id;

END $$;
