import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditEntry {
  id: string;
  admin_username: string;
  action: string;
  details: string | null;
  created_at: string;
}

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setLogs((data as AuditEntry[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    // Realtime subscription
    const channel = supabase
      .channel('audit_log_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_log' },
        (payload) => {
          setLogs(prev => [payload.new as AuditEntry, ...prev].slice(0, 200));
        }
      )
      .subscribe();

    // Fallback polling every 15 seconds
    const interval = setInterval(fetchLogs, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('حذف') || action.includes('delete')) return 'destructive';
    if (action.includes('إضافة') || action.includes('add') || action.includes('insert')) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">سجل العمليات ({logs.length})</h2>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد عمليات مسجلة حاليًا</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المشرف</TableHead>
                    <TableHead className="text-right">العملية</TableHead>
                    <TableHead className="text-right">التفاصيل</TableHead>
                    <TableHead className="text-right">التاريخ والوقت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(l => (
                    <TableRow key={l.id}>
                      <TableCell><Badge variant="outline">{l.admin_username}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={getActionColor(l.action)}>{l.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{l.details || '-'}</TableCell>
                      <TableCell className="text-sm">{new Date(l.created_at).toLocaleString('ar')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
