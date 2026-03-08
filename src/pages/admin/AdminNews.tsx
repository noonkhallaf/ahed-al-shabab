import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

const STORAGE_KEY = 'admin_news';

const defaultNews: NewsItem[] = [
  { id: 1, title: 'انطلاق الحملة الانتخابية لقائمة عهد الشباب', content: 'أعلنت قائمة عهد الشباب عن انطلاق حملتها الانتخابية...', date: '2026-03-01', category: 'أخبار' },
  { id: 2, title: 'لقاء مفتوح مع شباب المدينة', content: 'عقدت القائمة لقاءً مفتوحًا مع الشباب...', date: '2026-03-03', category: 'فعاليات' },
  { id: 3, title: 'جولة ميدانية في أحياء دورا', content: 'قام أعضاء القائمة بجولة ميدانية...', date: '2026-03-05', category: 'نشاطات' },
];

export default function AdminNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
    else { setItems(defaultNews); localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNews)); }
  }, []);

  const save = (list: NewsItem[]) => { setItems(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: NewsItem = {
      id: editing?.id || Date.now(),
      title: fd.get('title') as string,
      content: fd.get('content') as string,
      date: fd.get('date') as string,
      category: fd.get('category') as string,
    };
    if (editing) { save(items.map(n => n.id === editing.id ? item : n)); toast({ title: 'تم تعديل الخبر' }); }
    else { save([...items, item]); toast({ title: 'تم إضافة الخبر' }); }
    setEditing(null); setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('حذف هذا الخبر؟')) { save(items.filter(n => n.id !== id)); toast({ title: 'تم الحذف' }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إدارة الأخبار ({items.length})</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 ml-2" />إضافة خبر</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(n => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell>{n.category}</TableCell>
                    <TableCell>{n.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(n); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل خبر' : 'إضافة خبر جديد'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>العنوان</Label><Input name="title" defaultValue={editing?.title} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>التصنيف</Label><Input name="category" defaultValue={editing?.category || 'أخبار'} required /></div>
              <div className="space-y-2"><Label>التاريخ</Label><Input name="date" type="date" defaultValue={editing?.date || new Date().toISOString().split('T')[0]} required /></div>
            </div>
            <div className="space-y-2"><Label>المحتوى</Label><Textarea name="content" rows={5} defaultValue={editing?.content} required /></div>
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
