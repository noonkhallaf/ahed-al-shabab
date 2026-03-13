
-- Table to track candidate clicks/views
CREATE TABLE public.candidate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id integer NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  page text NOT NULL DEFAULT 'detail',
  visitor_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert candidate clicks" ON public.candidate_clicks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read candidate clicks" ON public.candidate_clicks FOR SELECT TO public USING (true);

-- Add promotion_priority to candidates (higher = more promoted, 0 = normal)
ALTER TABLE public.candidates ADD COLUMN promotion_priority integer NOT NULL DEFAULT 0;
