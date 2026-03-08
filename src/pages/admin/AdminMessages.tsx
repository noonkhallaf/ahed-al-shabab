import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, MessageSquare, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message { id: string; name: string | null; phone: string | null; message: string; created_at: string; is_read: boolean; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });
    setMessages((data as Message[]) || []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('suggestions').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const handleDelete = async (id: string) => {
    if (confirm('حذف هذه الرسالة؟')) {
      await supabase.from('suggestions').delete().eq('id', id);
      toast({ title: 'تم الحذف' }); fetchMessages();
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl"><head><title>تقرير الرسائل</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}h1{text-align:center}</style></head>
      <body><h1>تقرير الرسائل والاقتراحات - قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p><p>الإجمالي: ${messages.length} | غير مقروءة: ${unreadCount}</p>
      <table><tr><th>الاسم</th><th>الهاتف</th><th>الرسالة</th><th>التاريخ</th><th>الحالة</th></tr>
      ${messages.map(m => `<tr><td>${m.name || 'مجهول'}</td><td>${m.phone || '-'}</td><td>${m.message}</td><td>${new Date(m.created_at).toLocaleDateString('ar')}</td><td>${m.is_read ? 'مقروءة' : 'جديدة'}</td></tr>`).join('')}
      </table></body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">
          الرسائل والاقتراحات ({messages.length})
          {unreadCount > 0 && <Badge className="mr-2" variant="destructive">{unreadCount} جديدة</Badge>}
        </h2>
        <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة</Button>
      </div>
      {messages.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد رسائل حاليًا</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0"><div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الرسالة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {messages.map(m => (
                <TableRow key={m.id} className={!m.is_read ? 'bg-accent/30' : ''} onClick={() => !m.is_read && markRead(m.id)}>
                  <TableCell className="font-medium">{m.name || 'مجهول'}</TableCell>
                  <TableCell>{m.phone || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{m.message}</TableCell>
                  <TableCell className="text-sm">{new Date(m.created_at).toLocaleDateString('ar')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></CardContent></Card>
      )}
    </div>
  );
}
