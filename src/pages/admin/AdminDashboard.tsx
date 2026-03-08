import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Newspaper, MessageSquare, Vote, Eye, Globe, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [pollsCount, setPollsCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [candidates, news, messages, polls, views, today, unread, events] = await Promise.all([
        supabase.from('candidates').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('suggestions').select('*', { count: 'exact', head: true }),
        supabase.from('polls').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('events').select('*', { count: 'exact', head: true }),
      ]);
      setCandidatesCount(candidates.count || 0);
      setNewsCount(news.count || 0);
      setMessagesCount(messages.count || 0);
      setPollsCount(polls.count || 0);
      setTotalViews(views.count || 0);
      setTodayViews(today.count || 0);
      setUnreadMessages(unread.count || 0);
      setEventsCount(events.count || 0);
    })();
  }, []);

  const stats = [
    { title: 'المرشحين', value: candidatesCount, icon: Users, color: 'text-primary' },
    { title: 'الأخبار', value: newsCount, icon: Newspaper, color: 'text-secondary' },
    { title: 'الرسائل', value: `${messagesCount} (${unreadMessages} جديدة)`, icon: MessageSquare, color: 'text-destructive' },
    { title: 'الاستطلاعات', value: pollsCount, icon: Vote, color: 'text-primary' },
    { title: 'إجمالي الزيارات', value: totalViews.toLocaleString('ar'), icon: Globe, color: 'text-secondary' },
    { title: 'زيارات اليوم', value: todayViews, icon: Eye, color: 'text-green-600' },
    { title: 'الفعاليات', value: eventsCount, icon: Calendar, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">مرحبًا بك في لوحة التحكم</h2>
        <p className="text-muted-foreground">إدارة موقع قائمة عهد الشباب - انتخابات بلدية دورا</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">آخر الرسائل</CardTitle></CardHeader>
          <CardContent>
            {unreadMessages > 0 ? (
              <p className="text-sm text-destructive font-medium">لديك {unreadMessages} رسالة جديدة غير مقروءة</p>
            ) : (
              <p className="text-muted-foreground text-sm">جميع الرسائل مقروءة</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">نشاط الحملة</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">الحملة تسير بشكل ممتاز - {totalViews.toLocaleString('ar')} زيارة حقيقية حتى الآن</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
