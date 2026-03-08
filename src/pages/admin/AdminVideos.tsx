import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Video, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoItem { id: string; title: string; url: string; type: string; category: string | null; }

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVideos = async () => {
    const { data } = await supabase.from('media').select('*').eq('type', 'video').order('created_at', { ascending: false });
    setVideos((data as VideoItem[]) || []);
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast({ title: 'الفيديو كبير جدًا (الحد 50 ميغابايت)', variant: 'destructive' }); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `videos/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) { toast({ title: 'فشل الرفع', variant: 'destructive' }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
    setUploadUrl(publicUrl);
    setUploading(false);
    toast({ title: 'تم رفع الفيديو' });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = uploadMode === 'url' ? fd.get('url') as string : uploadUrl;
    if (!url) { toast({ title: 'يرجى رفع فيديو أو إضافة رابط', variant: 'destructive' }); return; }
    const item = { title: fd.get('title') as string, url, type: 'video' as const, category: fd.get('category') as string };

    if (editing) {
      await supabase.from('media').update(item).eq('id', editing.id);
      toast({ title: 'تم التعديل' });
    } else {
      await supabase.from('media').insert(item);
      toast({ title: 'تمت الإضافة' });
    }
    setDialogOpen(false); setUploadUrl(''); fetchVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف؟')) return;
    await supabase.from('media').delete().eq('id', id);
    toast({ title: 'تم الحذف' }); fetchVideos();
  };

  const getYoutubeEmbed = (url: string) => {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إدارة الفيديوهات ({videos.length})</h2>
        <Button onClick={() => { setEditing(null); setUploadUrl(''); setDialogOpen(true); }}><Plus className="h-4 w-4 ml-2" />إضافة فيديو</Button>
      </div>

      {videos.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">لا توجد فيديوهات</p></CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => {
            const ytEmbed = getYoutubeEmbed(v.url);
            return (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                    {ytEmbed ? <iframe src={ytEmbed} className="w-full h-full" allowFullScreen /> : <video src={v.url} controls className="w-full h-full object-cover" />}
                  </div>
                  <h3 className="font-bold text-sm">{v.title}</h3>
                  <p className="text-xs text-muted-foreground">{v.category}</p>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(v); setUploadUrl(v.url); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'تعديل' : 'إضافة فيديو'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>العنوان</Label><Input name="title" defaultValue={editing?.title} required /></div>
            <div className="space-y-2"><Label>التصنيف</Label><Input name="category" defaultValue={editing?.category || 'حملة'} required /></div>

            <div className="flex gap-2">
              <Button type="button" variant={uploadMode === 'file' ? 'default' : 'outline'} size="sm" onClick={() => setUploadMode('file')}>رفع فيديو</Button>
              <Button type="button" variant={uploadMode === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setUploadMode('url')}>رابط YouTube</Button>
            </div>

            {uploadMode === 'file' ? (
              <div className="space-y-2">
                <input ref={fileRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                {uploadUrl && <video src={uploadUrl} controls className="w-full rounded-lg max-h-40" />}
                <Button type="button" variant="outline" className="w-full" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
                  {uploading ? 'جارٍ الرفع...' : 'اختر فيديو من جهازك'}
                </Button>
              </div>
            ) : (
              <div className="space-y-2"><Label>رابط YouTube</Label><Input name="url" defaultValue={editing?.url} placeholder="https://youtube.com/watch?v=..." /></div>
            )}

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
