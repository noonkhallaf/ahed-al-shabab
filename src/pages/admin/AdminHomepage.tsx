import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SETTINGS_KEYS = [
  'heroTitle', 'heroSubtitle', 'duraText', 'campaignVideo',
  'contactPhone', 'contactEmail',
  'countdownDate', 'countdownVisible',
  'suggestionsBoost',
];

const defaults: Record<string, string> = {
  heroTitle: 'قائمة عهد الشباب – معًا نحو مستقبل أفضل',
  heroSubtitle: 'نحن شباب مدينة دورا، نحمل رؤية جديدة ونسعى لخدمة مجتمعنا بإخلاص وتفانٍ',
  duraText: 'مدينة دورا، بتاريخها العريق وأهلها الكرام، كانت دائمًا نموذجًا للعطاء والعمل المجتمعي.',
  campaignVideo: '',
  contactPhone: '+970599000000',
  contactEmail: 'info@ahd-shabab.ps',
  countdownDate: '2026-05-15T08:00:00',
  countdownVisible: 'true',
  suggestionsBoost: '847',
};

export default function AdminHomepage() {
  const [data, setData] = useState<Record<string, string>>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        const map = { ...defaults };
        settings.forEach(s => { if (s.value) map[s.key] = s.value; });
        setData(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    for (const key of SETTINGS_KEYS) {
      await supabase.from('site_settings').upsert(
        { key, value: data[key] || '' },
        { onConflict: 'key' }
      );
    }
    setSaving(false);
    toast({ title: 'تم حفظ التعديلات بنجاح' });
  };

  const update = (key: string, value: string) => setData(prev => ({ ...prev, [key]: value }));

  if (loading) return <div className="text-center py-8 text-muted-foreground">جارٍ التحميل...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إدارة الصفحة الرئيسية</h2>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
          حفظ التعديلات
        </Button>
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
        <CardHeader><CardTitle>العد التنازلي</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>إظهار العد التنازلي</Label>
            <Switch
              checked={data.countdownVisible !== 'false'}
              onCheckedChange={(checked) => update('countdownVisible', checked ? 'true' : 'false')}
            />
          </div>
          <div className="space-y-2">
            <Label>تاريخ الانتخابات</Label>
            <Input type="datetime-local" value={data.countdownDate?.replace('Z', '').substring(0, 16)} onChange={e => update('countdownDate', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الأرقام الترويجية (الاقتراحات)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>رقم المشاركات الوهمي (يُضاف للعدد الحقيقي في صفحة الاقتراحات)</Label>
            <Input type="number" value={data.suggestionsBoost} onChange={e => update('suggestionsBoost', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>معلومات التواصل</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>رقم الهاتف</Label><Input value={data.contactPhone} onChange={e => update('contactPhone', e.target.value)} /></div>
            <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input value={data.contactEmail} onChange={e => update('contactEmail', e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
