-- Fix AdminCandidates CRUD without built-in auth by allowing public writes on candidates
-- NOTE: This matches the project's current custom admin login approach.

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Add permissive public CRUD policies (keep existing authenticated-only policy as-is)
DROP POLICY IF EXISTS "Public can insert candidates" ON public.candidates;
DROP POLICY IF EXISTS "Public can update candidates" ON public.candidates;
DROP POLICY IF EXISTS "Public can delete candidates" ON public.candidates;

CREATE POLICY "Public can insert candidates"
ON public.candidates
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public can update candidates"
ON public.candidates
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete candidates"
ON public.candidates
FOR DELETE
TO public
USING (true);