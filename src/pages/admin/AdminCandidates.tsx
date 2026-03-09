import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, UserCircle, Upload, Loader2, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCandidates, type Candidate } from '@/hooks/useCandidates';
import { useQueryClient } from '@tanstack/react-query';
import { logAudit } from '@/lib/audit';

export default function AdminCandidates() {
  const { data: candidates = [], isLoading } = useCandidates();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hasUnsavedImage, setHasUnsavedImage] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast({ title: 'الصورة كبيرة جدًا', variant: 'destructive' }); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `candidates/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) { toast({ title: 'فشل رفع الصورة', variant: 'destructive' }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
    setImageUrl(publicUrl);
    setHasUnsavedImage(true);
    setUploading(false);
    toast({ title: 'تم رفع الصورة بنجاح - لا تنسَ الضغط على "حفظ"' });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item = {
      name: fd.get('name') as string,
      age: Number(fd.get('age')),
      specialty: fd.get('specialty') as string,
      education: fd.get('education') as string,
      location: fd.get('location') as string,
      experience: (fd.get('experience') as string).split('\n').filter(Boolean),
      achievements: (fd.get('achievements') as string).split('\n').filter(Boolean),
      bio: fd.get('bio') as string,
      quote: fd.get('quote') as string,
      image_url: imageUrl || null,
    };

    if (editing) {
      const { error } = await supabase.from('candidates').update(item).eq('id', editing.id);
      if (error) { toast({ title: 'فشل التعديل', variant: 'destructive' }); return; }
      toast({ title: imageUrl ? 'تم تعديل المرشح وحفظ الصورة بنجاح ✓' : 'تم تعديل المرشح بنجاح' });
    } else {
      const { error } = await supabase.from('candidates').insert(item);
      if (error) { toast({ title: 'فشل الإضافة', variant: 'destructive' }); return; }
      toast({ title: imageUrl ? 'تم إضافة المرشح وحفظ الصورة بنجاح ✓' : 'تم إضافة المرشح بنجاح' });
    }
    queryClient.invalidateQueries({ queryKey: ['candidates'] });
    setHasUnsavedImage(false);
    setEditing(null); 
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف المرشح؟')) return;

    const { data, error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('Failed to delete candidate', { id, error });
      toast({ title: 'فشل الحذف', description: error.message, variant: 'destructive' });
      return;
    }

    if (!data || data.length === 0) {
      toast({
        title: 'لم يتم حذف المرشح',
        description: 'لم يتم العثور على السجل أو لا توجد صلاحيات للحذف.',
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['candidates'] });
    toast({ title: 'تم حذف المرشح بنجاح' });
  };

  const openDialog = (c: Candidate | null) => { 
    setEditing(c); 
    setImageUrl(c?.image_url || ''); 
    setHasUnsavedImage(false);
    setDialogOpen(true); 
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && hasUnsavedImage) {
      if (!confirm('لديك صورة لم تُحفظ بعد. هل تريد الإغلاق بدون حفظ؟')) {
        return;
      }
    }
    setDialogOpen(open);
    if (!open) {
      setHasUnsavedImage(false);
      setImageUrl('');
    }
  };

  const handlePrint = () => {
    const printContent = `<html dir="rtl"><head><title>تقرير المرشحين</title>
    <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}h1{text-align:center}img{width:60px;height:60px;border-radius:50%;object-fit:cover}</style></head>
    <body><h1>تقرير مرشحي قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p>
    <table><tr><th>الصورة</th><th>الاسم</th><th>العمر</th><th>التخصص</th><th>المؤهل</th><th>السكن</th></tr>
    ${candidates.map(c => `<tr><td>${c.image_url ? `<img src="${c.image_url}"/>` : '-'}</td><td>${c.name}</td><td>${c.age}</td><td>${c.specialty}</td><td>${c.education}</td><td>${c.location}</td></tr>`).join('')}
    </table></body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">إدارة المرشحين ({candidates.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة</Button>
          <Button onClick={() => openDialog(null)}><Plus className="h-4 w-4 ml-2" />إضافة مرشح</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-right">الصورة</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">العمر</TableHead>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-right">المؤهل</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {candidates.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.image_url ? <img src={c.image_url} className="w-10 h-10 rounded-full object-cover" /> : <UserCircle className="h-10 w-10 text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.age}</TableCell>
                    <TableCell>{c.specialty}</TableCell>
                    <TableCell>{c.education}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(c)}><Pencil className="h-4 w-4" /></Button>
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

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل مرشح' : 'إضافة مرشح جديد'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>صورة المرشح</Label>
              <input ref={imgRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {imageUrl && <img src={imageUrl} className="w-24 h-24 rounded-full object-cover mx-auto" />}
              <Button type="button" variant="outline" className="w-full" disabled={uploading} onClick={() => imgRef.current?.click()}>
                {uploading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
                {uploading ? 'جارٍ الرفع...' : 'رفع صورة المرشح'}
              </Button>
              {hasUnsavedImage && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                  ⚠️ تم رفع صورة جديدة - لا تنسَ الضغط على "حفظ التعديلات" لحفظ الصورة نهائياً
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>الاسم الكامل</Label><Input name="name" defaultValue={editing?.name} required /></div>
              <div className="space-y-2"><Label>العمر</Label><Input name="age" type="number" defaultValue={editing?.age} required /></div>
              <div className="space-y-2"><Label>التخصص</Label><Input name="specialty" defaultValue={editing?.specialty} required /></div>
              <div className="space-y-2"><Label>المؤهل العلمي</Label><Input name="education" defaultValue={editing?.education} required /></div>
              <div className="space-y-2"><Label>مكان السكن</Label><Input name="location" defaultValue={editing?.location} required /></div>
            </div>
            <div className="space-y-2"><Label>الخبرات (كل خبرة في سطر)</Label><Textarea name="experience" rows={3} defaultValue={editing?.experience?.join('\n')} /></div>
            <div className="space-y-2"><Label>الإنجازات (كل إنجاز في سطر)</Label><Textarea name="achievements" rows={3} defaultValue={editing?.achievements?.join('\n')} /></div>
            <div className="space-y-2"><Label>نبذة شخصية</Label><Textarea name="bio" rows={3} defaultValue={editing?.bio} /></div>
            <div className="space-y-2"><Label>اقتباس شخصي</Label><Input name="quote" defaultValue={editing?.quote} /></div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>إلغاء</Button>
              <Button type="submit" className={hasUnsavedImage ? 'animate-pulse' : ''}>
                {editing ? 'حفظ التعديلات' : 'إضافة المرشح'}
                {hasUnsavedImage && ' 💾'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
