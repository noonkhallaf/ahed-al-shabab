import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, MessageSquare, Printer, CheckCircle, XCircle, Send, MessageCircleReply } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Message {
  id: string;
  name: string | null;
  phone: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
  is_approved: boolean;
  admin_reply: string | null;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyDialog, setReplyDialog] = useState<{ open: boolean; msg: Message | null }>({ open: false, msg: null });
  const [replyText, setReplyText] = useState('');

  const fetchMessages = async () => {
    const { data } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });
    setMessages((data as Message[]) || []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('suggestions').update({ is_read: true } as any).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const toggleApproval = async (id: string, approve: boolean) => {
    await supabase.from('suggestions').update({ is_approved: approve } as any).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_approved: approve } : m));
    toast({ title: approve ? 'تمت الموافقة على الاقتراح ✅' : 'تم إلغاء الموافقة' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('حذف هذه الرسالة؟')) {
      await supabase.from('suggestions').delete().eq('id', id);
      toast({ title: 'تم الحذف' });
      fetchMessages();
    }
  };

  const sendWhatsAppApproval = (msg: Message) => {
    const siteUrl = window.location.origin;
    const text = encodeURIComponent(
      `مرحبًا ${msg.name || 'صديقنا العزيز'} 🌟\n\n` +
      `يسعدنا إبلاغك بأنه تمت الموافقة على اقتراحك ونشره على موقع قائمة عهد الشباب!\n\n` +
      `💡 اقتراحك: "${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}"\n\n` +
      `🔗 شاهد اقتراحك على الموقع:\n${siteUrl}/suggestions\n\n` +
      `شكرًا لمساهمتك في بناء مستقبل أفضل لمدينتنا! 🙏\n` +
      `- فريق قائمة عهد الشباب`
    );
    const phone = (msg.phone || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleReply = async () => {
    if (!replyDialog.msg || !replyText.trim()) return;
    await supabase.from('suggestions').update({ admin_reply: replyText.trim() } as any).eq('id', replyDialog.msg.id);
    setMessages(prev => prev.map(m => m.id === replyDialog.msg!.id ? { ...m, admin_reply: replyText.trim() } : m));
    toast({ title: 'تم حفظ الرد بنجاح' });
    setReplyDialog({ open: false, msg: null });
    setReplyText('');
  };

  const unreadCount = messages.filter(m => !m.is_read).length;
  const approvedCount = messages.filter(m => m.is_approved).length;

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl"><head><title>تقرير الرسائل</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}h1{text-align:center}</style></head>
      <body><h1>تقرير الرسائل والاقتراحات - قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p><p>الإجمالي: ${messages.length} | غير مقروءة: ${unreadCount} | موافق عليها: ${approvedCount}</p>
      <table><tr><th>الاسم</th><th>الهاتف</th><th>الرسالة</th><th>التاريخ</th><th>الحالة</th><th>الرد</th></tr>
      ${messages.map(m => `<tr><td>${m.name || 'مجهول'}</td><td>${m.phone || '-'}</td><td>${m.message}</td><td>${new Date(m.created_at).toLocaleDateString('ar')}</td><td>${m.is_approved ? 'موافق عليه' : m.is_read ? 'مقروءة' : 'جديدة'}</td><td>${m.admin_reply || '-'}</td></tr>`).join('')}
      </table></body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">
          الرسائل والاقتراحات ({messages.length})
          {unreadCount > 0 && <Badge className="mr-2" variant="destructive">{unreadCount} جديدة</Badge>}
          <Badge className="mr-2 bg-green-600">{approvedCount} منشورة</Badge>
        </h2>
        <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة</Button>
      </div>
      {messages.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد رسائل حاليًا</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0"><div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الرسالة</TableHead>
              <TableHead className="text-right">الرد</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {messages.map(m => (
                <TableRow key={m.id} className={!m.is_read ? 'bg-accent/30' : ''} onClick={() => !m.is_read && markRead(m.id)}>
                  <TableCell className="font-medium">{m.name || 'مجهول'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{m.phone || '-'}</span>
                      {m.phone && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); sendWhatsAppApproval(m); }} title="إرسال إشعار واتساب">
                          <Send className="h-3.5 w-3.5 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">{m.message}</TableCell>
                  <TableCell className="max-w-[200px] text-sm text-muted-foreground">{m.admin_reply || '-'}</TableCell>
                  <TableCell className="text-sm">{new Date(m.created_at).toLocaleDateString('ar')}</TableCell>
                  <TableCell>
                    {m.is_approved ? (
                      <Badge className="bg-green-600">منشور ✅</Badge>
                    ) : (
                      <Badge variant="secondary">مخفي</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); toggleApproval(m.id, !m.is_approved); }} title={m.is_approved ? 'إلغاء النشر' : 'الموافقة والنشر'}>
                        {m.is_approved ? <XCircle className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setReplyDialog({ open: true, msg: m }); setReplyText(m.admin_reply || ''); }} title="الرد">
                        <MessageCircleReply className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></CardContent></Card>
      )}

      <Dialog open={replyDialog.open} onOpenChange={(open) => { if (!open) setReplyDialog({ open: false, msg: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>الرد على اقتراح {replyDialog.msg?.name || 'مجهول'}</DialogTitle>
          </DialogHeader>
          <div className="p-3 bg-muted rounded-lg text-sm mb-2">
            <p className="font-medium mb-1">الاقتراح:</p>
            <p>{replyDialog.msg?.message}</p>
          </div>
          <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="اكتب ردك هنا..." rows={4} />
          <DialogFooter>
            <Button onClick={handleReply} disabled={!replyText.trim()}>حفظ الرد</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
