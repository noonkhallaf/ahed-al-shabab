
-- Admin users table for multi-admin support
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'editor',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users readable by authenticated" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Admin users manageable by authenticated" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);

-- Audit log table
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_username text NOT NULL,
  action text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit log readable by all" ON public.audit_log FOR SELECT USING (true);
CREATE POLICY "Audit log insertable by all" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Allow public to read approved suggestions
CREATE POLICY "Public can read approved suggestions" ON public.suggestions FOR SELECT USING (is_approved = true);
