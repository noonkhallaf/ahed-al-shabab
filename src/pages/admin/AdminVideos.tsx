import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoItem { id: number; title: string; url: string; category: string; }

const STORAGE_KEY = 'admin_videos';

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setVideos(JSON.parse(stored));
  }, []);

  const save = (list: VideoItem[]) => { setVideos(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: VideoItem = { id: editing?.id || Date.now(), title: fd.get('title') as string, url: fd.get('url') as string, category: fd.get('category') as string };
    if (editing) { save(videos.map(v => v.id === editing.id ? item : v)); toast({ title: 'تم التعديل' }); }
    else { save([...videos, item]); toast({ title: 'تمت الإضافة' }); }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => { if (confirm('حذف؟')) save(videos.filter(v => v.id !== id)); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إدارة الفيديوهات ({videos.length})</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 ml-2" />إضافة فيديو</Button>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد فيديوهات حاليًا</p>
            <p className="text-sm text-muted-foreground">أضف فيديوهات الحملة عبر روابط YouTube</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-sm">{v.title}</h3>
                <p className="text-xs text-muted-foreground">{v.category}</p>
                <div className="flex gap-1 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(v); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل' : 'إضافة فيديو'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>العنوان</Label><Input name="title" defaultValue={editing?.title} required /></div>
            <div className="space-y-2"><Label>رابط YouTube</Label><Input name="url" defaultValue={editing?.url} required placeholder="https://youtube.com/watch?v=..." /></div>
            <div className="space-y-2"><Label>التصنيف</Label><Input name="category" defaultValue={editing?.category || 'حملة'} required /></div>
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
