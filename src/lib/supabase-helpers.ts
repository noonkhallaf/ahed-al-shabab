import { supabase } from '@/integrations/supabase/client';

// Track page view
export async function trackPageView(page: string) {
  const visitorId = getOrCreateVisitorId();
  await supabase.from('page_views').insert({
    page,
    visitor_id: visitorId,
    user_agent: navigator.userAgent,
    referrer: document.referrer || null,
  });
}

function getOrCreateVisitorId(): string {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}
