import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, UserPlus, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminUser {
  id: string;
  username: string;
  role: string;
  created_at: string;
  created_by: string | null;
}

export default function AdminUsers() {
  const { user } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('editor');

  const fetchUsers = async () => {
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    setUsers((data as AdminUser[]) || []);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({ title: 'يرجى تعبئة جميع الحقول', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('admin_users').insert({
      username: newUsername.trim(),
      password_hash: newPassword, // In production, hash this
      role: newRole,
      created_by: user?.username || 'admin',
    });
    if (error) {
      toast({ title: 'فشل الإضافة - قد يكون اسم المستخدم مكرر', variant: 'destructive' });
      return;
    }
    // Log the action
    await supabase.from('audit_log').insert({
      admin_username: user?.username || 'admin',
      action: 'إضافة مشرف جديد',
      details: `تم إضافة المشرف: ${newUsername.trim()} بصلاحية: ${newRole}`,
    });
    toast({ title: 'تم إضافة المشرف بنجاح' });
    setDialogOpen(false);
    setNewUsername('');
    setNewPassword('');
    setNewRole('editor');
    fetchUsers();
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`حذف المشرف ${u.username}؟`)) return;
    await supabase.from('admin_users').delete().eq('id', u.id);
    await supabase.from('audit_log').insert({
      admin_username: user?.username || 'admin',
      action: 'حذف مشرف',
      details: `تم حذف المشرف: ${u.username}`,
    });
    toast({ title: 'تم الحذف' });
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">إدارة المشرفين ({users.length})</h2>
        <Button onClick={() => setDialogOpen(true)}><UserPlus className="h-4 w-4 ml-2" />إضافة مشرف</Button>
      </div>

      {users.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لم يتم إضافة مشرفين إضافيين بعد</p>
          <p className="text-sm text-muted-foreground mt-1">المشرف الرئيسي يعمل بالبيانات الافتراضية</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0"><div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-right">اسم المستخدم</TableHead>
              <TableHead className="text-right">الصلاحية</TableHead>
              <TableHead className="text-right">أُضيف بواسطة</TableHead>
              <TableHead className="text-right">تاريخ الإضافة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                      {u.role === 'admin' ? 'مشرف كامل' : 'محرر'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.created_by || '-'}</TableCell>
                  <TableCell className="text-sm">{new Date(u.created_at).toLocaleDateString('ar')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></CardContent></Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إضافة مشرف جديد</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم المستخدم</Label>
              <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="admin.name" />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>الصلاحية</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مشرف كامل</SelectItem>
                  <SelectItem value="editor">محرر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleAdd}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
