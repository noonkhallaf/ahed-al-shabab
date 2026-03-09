import { supabase } from '@/integrations/supabase/client';

export async function logAudit(action: string, details: string, username?: string) {
  const stored = localStorage.getItem('admin_auth');
  let adminUsername = username || 'مجهول';
  if (stored) {
    try { adminUsername = JSON.parse(stored).username || adminUsername; } catch {}
  }
  await supabase.from('audit_log').insert({ action, details, admin_username: adminUsername });
}
