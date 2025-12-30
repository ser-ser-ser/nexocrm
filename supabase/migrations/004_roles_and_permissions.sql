-- 1. Create Enum Type for Roles
CREATE TYPE app_role AS ENUM ('independiente', 'admin_agencia', 'agente');

-- 2. Update profiles table structure
ALTER TABLE profiles 
  ALTER COLUMN role TYPE app_role USING role::app_role,
  ADD COLUMN IF NOT EXISTS comision_base NUMERIC(5,2) DEFAULT 50.00;

-- 3. Enable RLS (Should be already enabled, but safely ensure it)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Policy: INDEPENDIENTE (Burbuja aislada)
-- Can view/edit ONLY their own data
CREATE POLICY "Independientes: Acceso total a sus datos"
ON profiles
FOR ALL
USING (auth.uid() = id AND role = 'independiente');

-- Policy: ADMIN AGENCIA
-- Can view/edit ALL profiles in their agency
-- Note: Requires a recursive check or trusted data. Ideally, admin reads profiles where agency_id matches theirs.
CREATE POLICY "Admin Agencia: Gestiona su equipo"
ON profiles
FOR ALL
USING (
  role = 'admin_agencia' AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
);

-- Policy: AGENTE
-- Read only for agency team (to see colleagues)
CREATE POLICY "Agente: Ve equipo"
ON profiles
FOR SELECT
USING (
  role = 'agente' AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
);

-- Policy: AGENTE (Edit self)
CREATE POLICY "Agente: Edita su perfil"
ON profiles
FOR UPDATE
USING (auth.uid() = id);
