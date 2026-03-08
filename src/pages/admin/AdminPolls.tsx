import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, BarChart3, Printer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PollOption { id: string; poll_id: string; option_text: string; votes: number; }
interface Poll { id: string; question: string; is_active: boolean; options: PollOption[]; }

export default function AdminPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [editing, setEditing] = useState<Poll | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '']);

  const fetchPolls = async () => {
    const { data: pollsData } = await supabase.from('polls').select('*').order('created_at', { ascending: false });
    const { data: optionsData } = await supabase.from('poll_options').select('*');
    const mapped = ((pollsData as any[]) || []).map(p => ({
      ...p,
      options: ((optionsData as any[]) || []).filter(o => o.poll_id === p.id),
    }));
    setPolls(mapped);
  };

  useEffect(() => { fetchPolls(); }, []);

  const openNew = () => { setEditing(null); setNewOptions(['', '', '']); setDialogOpen(true); };
  const openEdit = (p: Poll) => { setEditing(p); setNewOptions(p.options.map(o => o.option_text)); setDialogOpen(true); };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const question = fd.get('question') as string;
    const opts = newOptions.filter(o => o.trim());
    if (opts.length < 2) { toast({ title: 'يجب إضافة خيارين على الأقل', variant: 'destructive' }); return; }

    if (editing) {
      await supabase.from('polls').update({ question }).eq('id', editing.id);
      await supabase.from('poll_options').delete().eq('poll_id', editing.id);
      await supabase.from('poll_options').insert(opts.map(text => {
        const existing = editing.options.find(o => o.option_text === text);
        return { poll_id: editing.id, option_text: text, votes: existing?.votes || 0 };
      }));
      toast({ title: 'تم التعديل' });
    } else {
      const { data: newPoll } = await supabase.from('polls').insert({ question, is_active: true }).select().single();
      if (newPoll) {
        await supabase.from('poll_options').insert(opts.map(text => ({ poll_id: (newPoll as any).id, option_text: text, votes: 0 })));
      }
      toast({ title: 'تمت الإضافة' });
    }
    setDialogOpen(false); fetchPolls();
  };

  const handleDelete = async (id: string) => {
    if (confirm('حذف؟')) { await supabase.from('polls').delete().eq('id', id); fetchPolls(); }
  };

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl"><head><title>تقرير الاستطلاعات</title>
      <style>body{font-family:sans-serif;padding:20px}h1{text-align:center}.poll{margin:20px 0;border:1px solid #ddd;padding:15px;border-radius:8px}.bar{height:20px;background:#3b82f6;border-radius:4px;margin:4px 0}</style></head>
      <body><h1>تقرير استطلاعات الرأي - قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p>
      ${polls.map(p => {
        const total = p.options.reduce((s, o) => s + o.votes, 0);
        return `<div class="poll"><h3>${p.question}</h3><p>إجمالي الأصوات: ${total}</p>
        ${p.options.map(o => `<p>${o.option_text}: ${o.votes} صوت (${total ? Math.round(o.votes/total*100) : 0}%)</p><div class="bar" style="width:${total ? (o.votes/total*100) : 0}%"></div>`).join('')}</div>`;
      }).join('')}
      </body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">استطلاعات الرأي ({polls.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة</Button>
          <Button onClick={openNew}><Plus className="h-4 w-4 ml-2" />إضافة استطلاع</Button>
        </div>
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
                {p.options.map(o => (
                  <div key={o.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{o.option_text}</span>
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
