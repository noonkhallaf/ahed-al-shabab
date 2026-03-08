import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const STORAGE_KEY = 'admin_homepage';

interface HomepageData {
  heroTitle: string;
  heroSubtitle: string;
  duraText: string;
  campaignVideo: string;
  contactPhone: string;
  contactEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
}

const defaults: HomepageData = {
  heroTitle: 'قائمة عهد الشباب – معًا نحو مستقبل أفضل',
  heroSubtitle: 'نحن شباب مدينة دورا، نحمل رؤية جديدة ونسعى لخدمة مجتمعنا بإخلاص وتفانٍ',
  duraText: 'مدينة دورا، بتاريخها العريق وأهلها الكرام، كانت دائمًا نموذجًا للعطاء والعمل المجتمعي.',
  campaignVideo: '',
  contactPhone: '+970599000000',
  contactEmail: 'info@ahd-shabab.ps',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  whatsappNumber: '+970599000000',
};

export default function AdminHomepage() {
  const [data, setData] = useState<HomepageData>(defaults);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setData(JSON.parse(stored));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast({ title: 'تم حفظ التعديلات بنجاح' });
  };

  const update = (key: keyof HomepageData, value: string) => setData(prev => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إدارة الصفحة الرئيسية</h2>
        <Button type="submit"><Save className="h-4 w-4 ml-2" />حفظ التعديلات</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>قسم البطل (Hero)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>العنوان الرئيسي</Label><Input value={data.heroTitle} onChange={e => update('heroTitle', e.target.value)} /></div>
          <div className="space-y-2"><Label>النص التعريفي</Label><Textarea value={data.heroSubtitle} onChange={e => update('heroSubtitle', e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>قسم مدينة دورا</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>النص الخاص بمدينة دورا</Label><Textarea value={data.duraText} onChange={e => update('duraText', e.target.value)} rows={4} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الفيديو</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2"><Label>رابط فيديو الحملة (YouTube)</Label><Input value={data.campaignVideo} onChange={e => update('campaignVideo', e.target.value)} placeholder="https://youtube.com/watch?v=..." /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>معلومات التواصل</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>رقم الهاتف</Label><Input value={data.contactPhone} onChange={e => update('contactPhone', e.target.value)} /></div>
            <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input value={data.contactEmail} onChange={e => update('contactEmail', e.target.value)} /></div>
            <div className="space-y-2"><Label>فيسبوك</Label><Input value={data.facebookUrl} onChange={e => update('facebookUrl', e.target.value)} /></div>
            <div className="space-y-2"><Label>انستغرام</Label><Input value={data.instagramUrl} onChange={e => update('instagramUrl', e.target.value)} /></div>
            <div className="space-y-2"><Label>واتساب</Label><Input value={data.whatsappNumber} onChange={e => update('whatsappNumber', e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
