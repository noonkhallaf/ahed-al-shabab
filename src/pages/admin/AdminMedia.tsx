import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Image, Loader2, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MediaItem { id: string; title: string; url: string; type: string; category: string | null; created_at: string; }

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems((data as MediaItem[]) || []);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { toast({ title: `${file.name} كبير جدًا`, variant: 'destructive' }); continue; }
      const ext = file.name.split('.').pop();
      const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) { toast({ title: `فشل رفع ${file.name}`, variant: 'destructive' }); continue; }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      await supabase.from('media').insert({ title: file.name, url: publicUrl, type, category: 'عام' });
    }

    setUploading(false);
    toast({ title: 'تم رفع الملفات بنجاح' });
    fetchMedia();
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('حذف هذا الملف؟')) return;
    // Extract path from URL
    const urlParts = item.url.split('/media/');
    if (urlParts[1]) {
      await supabase.storage.from('media').remove([urlParts[1]]);
    }
    await supabase.from('media').delete().eq('id', item.id);
    toast({ title: 'تم الحذف' });
    fetchMedia();
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'تم نسخ الرابط' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">مكتبة الوسائط ({items.length})</h2>
        <div>
          <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
            {uploading ? 'جارٍ الرفع...' : 'رفع ملفات'}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد ملفات حاليًا</p>
            <p className="text-sm text-muted-foreground">ارفع صور وفيديوهات الحملة هنا</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square bg-muted relative">
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium truncate">{item.title}</p>
                <div className="flex gap-1 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => copyUrl(item.id, item.url)}>
                    {copiedId === item.id ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
