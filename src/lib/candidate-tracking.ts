import { supabase } from '@/integrations/supabase/client';

export async function trackCandidateClick(candidateId: number, page: string = 'detail') {
  const visitorId = localStorage.getItem('visitor_id') || 'unknown';
  await supabase.from('candidate_clicks').insert({
    candidate_id: candidateId,
    page,
    visitor_id: visitorId,
  });
}
