import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Newspaper, MessageSquare, Vote, Eye, TrendingUp } from 'lucide-react';
import { candidatesData } from '@/data/candidates';

const getStoredCount = (key: string, fallback: number = 0) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data).length : fallback;
  } catch { return fallback; }
};

export default function AdminDashboard() {
  const stats = [
    { title: 'المرشحين', value: candidatesData.length, icon: Users, color: 'text-primary' },
    { title: 'الأخبار', value: getStoredCount('admin_news', 6), icon: Newspaper, color: 'text-secondary' },
    { title: 'الرسائل', value: getStoredCount('admin_messages', 0), icon: MessageSquare, color: 'text-destructive' },
    { title: 'استطلاعات الرأي', value: getStoredCount('admin_polls', 3), icon: Vote, color: 'text-primary' },
    { title: 'زيارات اليوم', value: 247, icon: Eye, color: 'text-secondary' },
    { title: 'نمو الأسبوع', value: '+18%', icon: TrendingUp, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">مرحبًا بك في لوحة التحكم</h2>
        <p className="text-muted-foreground">إدارة موقع قائمة عهد الشباب - انتخابات بلدية دورا</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">آخر الرسائل</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">لا توجد رسائل جديدة حاليًا</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">نشاط الحملة</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">الحملة تسير بشكل ممتاز - تابع إدارة المحتوى</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
