import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProgramItem { id: number; title: string; description: string; icon: string; }

const STORAGE_KEY = 'admin_program';
const defaultProgram: ProgramItem[] = [
  { id: 1, title: 'دعم الشباب', description: 'تمكين الشباب وتوفير فرص عمل وتدريب', icon: '💪' },
  { id: 2, title: 'تطوير التعليم', description: 'تحسين البرامج التعليمية والمنح الدراسية', icon: '📚' },
  { id: 3, title: 'دعم الرياضة', description: 'بناء ملاعب ودعم الأندية الرياضية', icon: '⚽' },
  { id: 4, title: 'العمل المجتمعي', description: 'تعزيز التكافل الاجتماعي والتطوع', icon: '🤝' },
  { id: 5, title: 'تطوير الخدمات', description: 'تحسين البنية التحتية والخدمات البلدية', icon: '🏗️' },
  { id: 6, title: 'البيئة', description: 'الحفاظ على البيئة وتجميل المدينة', icon: '🌿' },
];

export default function AdminProgram() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [editing, setEditing] = useState<ProgramItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
    else { setItems(defaultProgram); localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgram)); }
  }, []);

  const save = (list: ProgramItem[]) => { setItems(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: ProgramItem = {
      id: editing?.id || Date.now(),
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      icon: fd.get('icon') as string,
    };
    if (editing) { save(items.map(p => p.id === editing.id ? item : p)); toast({ title: 'تم التعديل' }); }
    else { save([...items, item]); toast({ title: 'تمت الإضافة' }); }
    setEditing(null); setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('حذف هذا المحور؟')) { save(items.filter(p => p.id !== id)); toast({ title: 'تم الحذف' }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">البرنامج الانتخابي ({items.length} محاور)</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 ml-2" />إضافة محور</Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل محور' : 'إضافة محور جديد'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2 col-span-3"><Label>العنوان</Label><Input name="title" defaultValue={editing?.title} required /></div>
              <div className="space-y-2"><Label>أيقونة</Label><Input name="icon" defaultValue={editing?.icon || '📌'} required /></div>
            </div>
            <div className="space-y-2"><Label>الوصف</Label><Textarea name="description" rows={3} defaultValue={editing?.description} required /></div>
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
