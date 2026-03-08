
-- Add is_approved and admin_reply columns to suggestions
ALTER TABLE public.suggestions ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.suggestions ADD COLUMN IF NOT EXISTS admin_reply TEXT;

-- Add countdown and social proof settings keys
-- (these will be inserted via upsert in the app)
