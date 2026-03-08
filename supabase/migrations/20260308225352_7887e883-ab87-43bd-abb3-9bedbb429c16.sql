
CREATE TABLE public.candidates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  specialty TEXT NOT NULL,
  education TEXT NOT NULL,
  location TEXT NOT NULL,
  experience TEXT[] NOT NULL DEFAULT '{}',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates are publicly readable" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage candidates" ON public.candidates FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
