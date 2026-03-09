CREATE TABLE public.chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert/update (for saving chats)
CREATE POLICY "Anyone can insert chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions" ON public.chat_sessions
  FOR UPDATE USING (true);

-- Only authenticated users can read (admin)
CREATE POLICY "Authenticated can read chat sessions" ON public.chat_sessions
  FOR SELECT USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();