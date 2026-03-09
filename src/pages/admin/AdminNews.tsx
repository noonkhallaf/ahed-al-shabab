import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Printer, Upload, Loader2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAudit } from '@/lib/audit';

interface NewsItem { id: string; title: string; content: string; published_at: string; category: string; image_url: string | null; video_url: string | null; }

export default function AdminNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
    setItems((data as NewsItem[]) || []);
  };

  useEffect(() => { fetchNews(); }, []);

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try { const url = await uploadFile(file, 'news'); setImageUrl(url); toast({ title: 'تم رفع الصورة' }); }
    catch { toast({ title: 'فشل رفع الصورة', variant: 'destructive' }); }
    setUploadingImg(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVid(true);
    try { const url = await uploadFile(file, 'news-videos'); setVideoUrl(url); toast({ title: 'تم رفع الفيديو' }); }
    catch { toast({ title: 'فشل رفع الفيديو', variant: 'destructive' }); }
    setUploadingVid(false);
  };

  const openDialog = (item: NewsItem | null) => {
    setEditing(item);
    setImageUrl(item?.image_url || '');
    setVideoUrl(item?.video_url || '');
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item = {
      title: fd.get('title') as string,
      content: fd.get('content') as string,
      published_at: fd.get('date') as string,
      category: fd.get('category') as string,
      image_url: imageUrl || null,
      video_url: videoUrl || null,
    };
    if (editing) {
      await supabase.from('news').update(item).eq('id', editing.id);
      toast({ title: 'تم تعديل الخبر' });
    } else {
      await supabase.from('news').insert(item);
      toast({ title: 'تم إضافة الخبر' });
    }
    setDialogOpen(false); fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (confirm('حذف هذا الخبر؟')) {
      await supabase.from('news').delete().eq('id', id);
      toast({ title: 'تم الحذف' }); fetchNews();
    }
  };

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl"><head><title>تقرير الأخبار</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}h1{text-align:center}img{max-width:120px;max-height:80px}</style></head>
      <body><h1>تقرير أخبار الحملة - قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p>
      <table><tr><th>الصورة</th><th>العنوان</th><th>التصنيف</th><th>التاريخ</th><th>المحتوى</th></tr>
      ${items.map(n => `<tr><td>${n.image_url ? `<img src="${n.image_url}"/>` : '-'}</td><td>${n.title}</td><td>${n.category}</td><td>${n.published_at}</td><td>${n.content.substring(0, 100)}...</td></tr>`).join('')}
      </table></body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">إدارة الأخبار ({items.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة</Button>
          <Button onClick={() => openDialog(null)}><Plus className="h-4 w-4 ml-2" />إضافة خبر</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-right">الصورة</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {items.map(n => (
                  <TableRow key={n.id}>
                    <TableCell>
                      {n.image_url ? <img src={n.image_url} className="w-16 h-12 object-cover rounded" /> : <span className="text-muted-foreground text-xs">بدون صورة</span>}
                    </TableCell>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell>{n.category}</TableCell>
                    <TableCell>{n.published_at}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(n)}><Pencil className="h-4 w-4" /></Button>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل خبر' : 'إضافة خبر جديد'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>العنوان</Label><Input name="title" defaultValue={editing?.title} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>التصنيف</Label><Input name="category" defaultValue={editing?.category || 'أخبار'} required /></div>
              <div className="space-y-2"><Label>التاريخ</Label><Input name="date" type="date" defaultValue={editing?.published_at || new Date().toISOString().split('T')[0]} required /></div>
            </div>
            <div className="space-y-2"><Label>المحتوى</Label><Textarea name="content" rows={5} defaultValue={editing?.content} required /></div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>صورة الخبر</Label>
              <input ref={imgRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {imageUrl && (
                <div className="relative"><img src={imageUrl} className="w-full max-h-40 object-cover rounded-lg" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 left-2 h-6 w-6" onClick={() => setImageUrl('')}><X className="h-3 w-3" /></Button>
                </div>
              )}
              <Button type="button" variant="outline" className="w-full" disabled={uploadingImg} onClick={() => imgRef.current?.click()}>
                {uploadingImg ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
                {uploadingImg ? 'جارٍ الرفع...' : 'رفع صورة'}
              </Button>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label>فيديو الخبر</Label>
              <input ref={vidRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              {videoUrl && (
                <div className="relative"><video src={videoUrl} controls className="w-full max-h-40 rounded-lg" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 left-2 h-6 w-6" onClick={() => setVideoUrl('')}><X className="h-3 w-3" /></Button>
                </div>
              )}
              <Button type="button" variant="outline" className="w-full" disabled={uploadingVid} onClick={() => vidRef.current?.click()}>
                {uploadingVid ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
                {uploadingVid ? 'جارٍ الرفع...' : 'رفع فيديو'}
              </Button>
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
