import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';
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

  useEffect(() => {
    supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => setLogs((data as AuditEntry[]) || []));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-bold">سجل العمليات ({logs.length})</h2>
      {logs.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد عمليات مسجلة حاليًا</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0"><div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-right">المشرف</TableHead>
              <TableHead className="text-right">العملية</TableHead>
              <TableHead className="text-right">التفاصيل</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {logs.map(l => (
                <TableRow key={l.id}>
                  <TableCell><Badge variant="outline">{l.admin_username}</Badge></TableCell>
                  <TableCell className="font-medium">{l.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{l.details || '-'}</TableCell>
                  <TableCell className="text-sm">{new Date(l.created_at).toLocaleString('ar')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></CardContent></Card>
      )}
    </div>
  );
}
