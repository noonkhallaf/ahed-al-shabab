import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, MessageSquare, Phone, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Message { id: number; name: string; phone: string; message: string; date: string; read: boolean; }

const STORAGE_KEY = 'admin_messages';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  const save = (list: Message[]) => { setMessages(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

  const markRead = (id: number) => save(messages.map(m => m.id === id ? { ...m, read: true } : m));
  const handleDelete = (id: number) => { if (confirm('حذف هذه الرسالة؟')) { save(messages.filter(m => m.id !== id)); toast({ title: 'تم الحذف' }); } };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">
          الرسائل والاقتراحات ({messages.length})
          {unreadCount > 0 && <Badge className="mr-2" variant="destructive">{unreadCount} جديدة</Badge>}
        </h2>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد رسائل حاليًا</p>
            <p className="text-sm text-muted-foreground">ستظهر الرسائل هنا عندما يرسل الزوار اقتراحاتهم عبر الموقع</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الهاتف</TableHead>
                    <TableHead className="text-right">الرسالة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map(m => (
                    <TableRow key={m.id} className={!m.read ? 'bg-accent/30' : ''} onClick={() => markRead(m.id)}>
                      <TableCell className="font-medium">{m.name || 'مجهول'}</TableCell>
                      <TableCell>{m.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{m.message}</TableCell>
                      <TableCell className="text-sm">{m.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
