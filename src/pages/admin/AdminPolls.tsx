import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface PollOption { label: string; votes: number; }
interface Poll { id: number; question: string; options: PollOption[]; active: boolean; }

const STORAGE_KEY = 'admin_polls';
const defaultPolls: Poll[] = [
  { id: 1, question: 'ما رأيك في برنامج قائمة عهد الشباب؟', options: [{ label: 'ممتاز', votes: 45 }, { label: 'جيد', votes: 23 }, { label: 'يحتاج تطوير', votes: 8 }], active: true },
  { id: 2, question: 'هل تؤيد برنامج قائمة عهد الشباب؟', options: [{ label: 'نعم', votes: 67 }, { label: 'ربما', votes: 15 }, { label: 'لا', votes: 5 }], active: true },
];

export default function AdminPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [editing, setEditing] = useState<Poll | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '']);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPolls(JSON.parse(stored));
    else { setPolls(defaultPolls); localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPolls)); }
  }, []);

  const save = (list: Poll[]) => { setPolls(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

  const openNew = () => { setEditing(null); setNewOptions(['', '', '']); setDialogOpen(true); };
  const openEdit = (p: Poll) => { setEditing(p); setNewOptions(p.options.map(o => o.label)); setDialogOpen(true); };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const question = fd.get('question') as string;
    const opts = newOptions.filter(o => o.trim());
    if (opts.length < 2) { toast({ title: 'يجب إضافة خيارين على الأقل', variant: 'destructive' }); return; }

    if (editing) {
      const updated: Poll = { ...editing, question, options: opts.map(label => {
        const existing = editing.options.find(o => o.label === label);
        return { label, votes: existing?.votes || 0 };
      })};
      save(polls.map(p => p.id === editing.id ? updated : p));
      toast({ title: 'تم التعديل' });
    } else {
      save([...polls, { id: Date.now(), question, options: opts.map(label => ({ label, votes: 0 })), active: true }]);
      toast({ title: 'تمت الإضافة' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => { if (confirm('حذف؟')) { save(polls.filter(p => p.id !== id)); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">استطلاعات الرأي ({polls.length})</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 ml-2" />إضافة استطلاع</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {polls.map(p => {
          const totalVotes = p.options.reduce((s, o) => s + o.votes, 0);
          return (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{p.question}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.options.map((o, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{o.label}</span>
                      <span className="text-muted-foreground">{o.votes} صوت ({totalVotes ? Math.round(o.votes / totalVotes * 100) : 0}%)</span>
                    </div>
                    <Progress value={totalVotes ? (o.votes / totalVotes) * 100 : 0} />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">إجمالي الأصوات: {totalVotes}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل استطلاع' : 'إضافة استطلاع جديد'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>السؤال</Label><Input name="question" defaultValue={editing?.question} required /></div>
            <div className="space-y-2">
              <Label>الخيارات</Label>
              {newOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={opt} onChange={e => { const n = [...newOptions]; n[i] = e.target.value; setNewOptions(n); }} placeholder={`خيار ${i + 1}`} />
                  {newOptions.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => setNewOptions(newOptions.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></Button>}
                </div>
              ))}
              {newOptions.length < 6 && <Button type="button" variant="outline" size="sm" onClick={() => setNewOptions([...newOptions, ''])}><Plus className="h-3 w-3 ml-1" />إضافة خيار</Button>}
            </div>
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
