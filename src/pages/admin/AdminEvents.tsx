import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Calendar, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EventItem { id: string; title: string; description: string | null; location: string | null; event_date: string; }

export default function AdminEvents() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    setItems((data as EventItem[]) || []);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      location: fd.get('location') as string,
      event_date: fd.get('event_date') as string,
    };
    if (editing) {
      await supabase.from('events').update(item).eq('id', editing.id);
      toast({ title: 'تم التعديل' });
    } else {
      await supabase.from('events').insert(item);
      toast({ title: 'تمت الإضافة' });
    }
    setEditing(null); setDialogOpen(false); fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm('حذف؟')) { await supabase.from('events').delete().eq('id', id); toast({ title: 'تم الحذف' }); fetchEvents(); }
  };

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl"><head><title>تقرير الفعاليات</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}h1{text-align:center}</style></head>
      <body><h1>تقرير فعاليات الحملة - قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p>
      <table><tr><th>الفعالية</th><th>المكان</th><th>التاريخ</th><th>الوصف</th></tr>
      ${items.map(e => `<tr><td>${e.title}</td><td>${e.location || '-'}</td><td>${e.event_date}</td><td>${e.description || '-'}</td></tr>`).join('')}
      </table></body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">إدارة الفعاليات ({items.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة</Button>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 ml-2" />إضافة فعالية</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0"><div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-right">الفعالية</TableHead>
              <TableHead className="text-right">المكان</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {items.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell>{e.location || '-'}</TableCell>
                  <TableCell>{e.event_date}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(e); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل فعالية' : 'إضافة فعالية جديدة'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>عنوان الفعالية</Label><Input name="title" defaultValue={editing?.title} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>المكان</Label><Input name="location" defaultValue={editing?.location || ''} /></div>
              <div className="space-y-2"><Label>التاريخ</Label><Input name="event_date" type="date" defaultValue={editing?.event_date || new Date().toISOString().split('T')[0]} required /></div>
            </div>
            <div className="space-y-2"><Label>الوصف</Label><Textarea name="description" rows={3} defaultValue={editing?.description || ''} /></div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
              <Button type="submit">حفظ</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
