import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from '@/hooks/use-toast';
import { Save, Lock, Palette } from 'lucide-react';

export default function AdminSettings() {
  const { changePassword } = useAdminAuth();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast({ title: 'كلمة المرور الجديدة غير متطابقة', variant: 'destructive' });
      return;
    }
    if (newPass.length < 8) {
      toast({ title: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', variant: 'destructive' });
      return;
    }
    if (changePassword(oldPass, newPass)) {
      toast({ title: 'تم تغيير كلمة المرور بنجاح' });
      setOldPass(''); setNewPass(''); setConfirmPass('');
    } else {
      toast({ title: 'كلمة المرور الحالية غير صحيحة', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-heading font-bold">إعدادات النظام</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />تغيير كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>كلمة المرور الحالية</Label>
              <Input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور الجديدة</Label>
              <Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>تأكيد كلمة المرور</Label>
              <Input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
            </div>
            <Button type="submit"><Save className="h-4 w-4 ml-2" />تغيير كلمة المرور</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />معلومات النظام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>اسم الموقع:</strong> قائمة عهد الشباب</p>
          <p><strong>الإصدار:</strong> 1.0.0</p>
          <p><strong>نوع الانتخابات:</strong> انتخابات بلدية دورا</p>
          <p><strong>مطور النظام:</strong> نور الدين وائل خلاف</p>
          <p><strong>تواصل واتساب:</strong> <a href="https://wa.me/972594606294" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+972594606294</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
