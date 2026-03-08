import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Globe } from 'lucide-react';

export default function AdminStats() {
  const pageStats = [
    { page: 'الصفحة الرئيسية', views: 1250, percentage: 100 },
    { page: 'المرشحين', views: 830, percentage: 66 },
    { page: 'البرنامج الانتخابي', views: 620, percentage: 50 },
    { page: 'الأخبار', views: 450, percentage: 36 },
    { page: 'استطلاع الرأي', views: 380, percentage: 30 },
    { page: 'التواصل', views: 210, percentage: 17 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold">إحصائيات الموقع</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center"><Globe className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">3,740</p><p className="text-sm text-muted-foreground">إجمالي الزيارات</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Users className="h-8 w-8 mx-auto text-secondary mb-2" /><p className="text-2xl font-bold">1,820</p><p className="text-sm text-muted-foreground">زوار فريدون</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" /><p className="text-2xl font-bold">+24%</p><p className="text-sm text-muted-foreground">نمو أسبوعي</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><BarChart3 className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">4:32</p><p className="text-sm text-muted-foreground">متوسط مدة الزيارة</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>أكثر الصفحات زيارة</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {pageStats.map(s => (
            <div key={s.page} className="space-y-1">
              <div className="flex justify-between text-sm"><span>{s.page}</span><span className="text-muted-foreground">{s.views} زيارة</span></div>
              <Progress value={s.percentage} />
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        ملاحظة: هذه إحصائيات تجريبية. لتفعيل الإحصائيات الحقيقية يُنصح بربط Google Analytics أو قاعدة بيانات سحابية.
      </p>
    </div>
  );
}
