import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, UserCircle } from 'lucide-react';
import { candidatesData } from '@/data/candidates';
import { toast } from '@/hooks/use-toast';

interface CandidateForm {
  id: number;
  name: string;
  age: number;
  specialty: string;
  education: string;
  location: string;
  experience: string;
  achievements: string;
  bio: string;
  quote: string;
}

const STORAGE_KEY = 'admin_candidates';

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<CandidateForm[]>([]);
  const [editing, setEditing] = useState<CandidateForm | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCandidates(JSON.parse(stored));
    } else {
      const initial = candidatesData.map(c => ({
        ...c,
        experience: c.experience.join('\n'),
        achievements: c.achievements.join('\n'),
      }));
      setCandidates(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  const save = (list: CandidateForm[]) => {
    setCandidates(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: CandidateForm = {
      id: editing?.id || Date.now(),
      name: fd.get('name') as string,
      age: Number(fd.get('age')),
      specialty: fd.get('specialty') as string,
      education: fd.get('education') as string,
      location: fd.get('location') as string,
      experience: fd.get('experience') as string,
      achievements: fd.get('achievements') as string,
      bio: fd.get('bio') as string,
      quote: fd.get('quote') as string,
    };
    if (editing) {
      save(candidates.map(c => c.id === editing.id ? item : c));
      toast({ title: 'تم تعديل المرشح بنجاح' });
    } else {
      save([...candidates, item]);
      toast({ title: 'تم إضافة المرشح بنجاح' });
    }
    setEditing(null);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المرشح؟')) {
      save(candidates.filter(c => c.id !== id));
      toast({ title: 'تم حذف المرشح' });
    }
  };

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (c: CandidateForm) => { setEditing(c); setDialogOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إدارة المرشحين ({candidates.length})</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 ml-2" />إضافة مرشح</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">العمر</TableHead>
                  <TableHead className="text-right">التخصص</TableHead>
                  <TableHead className="text-right">المؤهل</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-8 w-8 text-muted-foreground" />
                        {c.name}
                      </div>
                    </TableCell>
                    <TableCell>{c.age}</TableCell>
                    <TableCell>{c.specialty}</TableCell>
                    <TableCell>{c.education}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? 'تعديل مرشح' : 'إضافة مرشح جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input name="name" defaultValue={editing?.name} required />
              </div>
              <div className="space-y-2">
                <Label>العمر</Label>
                <Input name="age" type="number" defaultValue={editing?.age} required />
              </div>
              <div className="space-y-2">
                <Label>التخصص</Label>
                <Input name="specialty" defaultValue={editing?.specialty} required />
              </div>
              <div className="space-y-2">
                <Label>المؤهل العلمي</Label>
                <Input name="education" defaultValue={editing?.education} required />
              </div>
              <div className="space-y-2">
                <Label>مكان السكن</Label>
                <Input name="location" defaultValue={editing?.location} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الخبرات (كل خبرة في سطر)</Label>
              <Textarea name="experience" rows={3} defaultValue={editing?.experience} />
            </div>
            <div className="space-y-2">
              <Label>الإنجازات (كل إنجاز في سطر)</Label>
              <Textarea name="achievements" rows={3} defaultValue={editing?.achievements} />
            </div>
            <div className="space-y-2">
              <Label>نبذة شخصية</Label>
              <Textarea name="bio" rows={3} defaultValue={editing?.bio} />
            </div>
            <div className="space-y-2">
              <Label>اقتباس شخصي</Label>
              <Input name="quote" defaultValue={editing?.quote} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
              <Button type="submit">{editing ? 'حفظ التعديلات' : 'إضافة المرشح'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
