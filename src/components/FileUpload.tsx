import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
  currentUrl?: string;
  folder?: string;
}

export default function FileUpload({ onUpload, accept = 'image/*', label = 'رفع ملف', currentUrl, folder = 'uploads' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'الملف كبير جدًا (الحد الأقصى 10 ميغابايت)', variant: 'destructive' });
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) {
      toast({ title: 'فشل في رفع الملف', description: error.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
    setPreview(publicUrl);
    onUpload(publicUrl);
    setUploading(false);
    toast({ title: 'تم رفع الملف بنجاح' });
  };

  const clearFile = () => {
    setPreview(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const isVideo = accept.includes('video');

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
      
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-input">
          {isVideo ? (
            <video src={preview} controls className="w-full max-h-48 object-cover" />
          ) : (
            <img src={preview} alt="معاينة" className="w-full max-h-48 object-cover" />
          )}
          <Button type="button" variant="destructive" size="icon" className="absolute top-2 left-2 h-6 w-6" onClick={clearFile}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Button type="button" variant="outline" className="w-full" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
        {uploading ? 'جارٍ الرفع...' : label}
      </Button>
    </div>
  );
}
