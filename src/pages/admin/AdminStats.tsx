import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Globe, Printer, MessageSquare, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface PageStat { page: string; views: number; }

export default function AdminStats() {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [dailyData, setDailyData] = useState<{ date: string; views: number }[]>([]);
  const [suggestionsCount, setSuggestionsCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Total views
    const { count: total } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
    setTotalViews(total || 0);

    // Unique visitors
    const { data: visitors } = await supabase.from('page_views').select('visitor_id');
    const unique = new Set((visitors || []).map((v: any) => v.visitor_id)).size;
    setUniqueVisitors(unique);

    // Today views
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today);
    setTodayViews(todayCount || 0);

    // Page stats
    const { data: allViews } = await supabase.from('page_views').select('page');
    const pageCounts: Record<string, number> = {};
    (allViews || []).forEach((v: any) => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1; });
    const pageNames: Record<string, string> = { '/': 'الرئيسية', '/candidates': 'المرشحين', '/program': 'البرنامج', '/news': 'الأخبار', '/poll': 'الاستطلاع', '/contact': 'التواصل', '/suggestions': 'الاقتراحات' };
    const stats = Object.entries(pageCounts).map(([page, views]) => ({ page: pageNames[page] || page, views })).sort((a, b) => b.views - a.views);
    setPageStats(stats);

    // Daily data (last 14 days)
    const days: { date: string; views: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const nextDay = new Date(d); nextDay.setDate(nextDay.getDate() + 1);
      const { count } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', dateStr).lt('created_at', nextDay.toISOString().split('T')[0]);
      days.push({ date: d.toLocaleDateString('ar', { month: 'short', day: 'numeric' }), views: count || 0 });
    }
    setDailyData(days);

    // Suggestions count
    const { count: sugCount } = await supabase.from('suggestions').select('*', { count: 'exact', head: true });
    setSuggestionsCount(sugCount || 0);
  };

  const maxViews = Math.max(...pageStats.map(s => s.views), 1);
  const COLORS = ['hsl(221, 83%, 53%)', 'hsl(36, 90%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(0, 72%, 50%)', 'hsl(280, 60%, 50%)', 'hsl(180, 60%, 45%)', 'hsl(60, 70%, 45%)'];

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl"><head><title>تقرير الإحصائيات</title>
      <style>body{font-family:sans-serif;padding:20px}h1{text-align:center}.stat{display:inline-block;margin:10px;padding:15px;border:1px solid #ddd;border-radius:8px;min-width:150px;text-align:center}.stat h3{font-size:24px;margin:0}.stat p{color:#666;margin:5px 0 0}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}</style></head>
      <body><h1>تقرير إحصائيات الموقع - قائمة عهد الشباب</h1><p>التاريخ: ${new Date().toLocaleDateString('ar')}</p>
      <div><div class="stat"><h3>${totalViews.toLocaleString('ar')}</h3><p>إجمالي الزيارات</p></div>
      <div class="stat"><h3>${uniqueVisitors.toLocaleString('ar')}</h3><p>زوار فريدون</p></div>
      <div class="stat"><h3>${todayViews.toLocaleString('ar')}</h3><p>زيارات اليوم</p></div>
      <div class="stat"><h3>${suggestionsCount.toLocaleString('ar')}</h3><p>الاقتراحات</p></div></div>
      <h2>أكثر الصفحات زيارة</h2>
      <table><tr><th>الصفحة</th><th>الزيارات</th><th>النسبة</th></tr>
      ${pageStats.map(s => `<tr><td>${s.page}</td><td>${s.views}</td><td>${Math.round(s.views/maxViews*100)}%</td></tr>`).join('')}
      </table></body></html>`;
    const w = window.open('', '_blank'); w?.document.write(printContent); w?.document.close(); w?.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">إحصائيات الموقع</h2>
        <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" />طباعة التقرير</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center"><Globe className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">{totalViews.toLocaleString('ar')}</p><p className="text-sm text-muted-foreground">إجمالي الزيارات</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Users className="h-8 w-8 mx-auto text-secondary mb-2" /><p className="text-2xl font-bold">{uniqueVisitors.toLocaleString('ar')}</p><p className="text-sm text-muted-foreground">زوار فريدون</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Eye className="h-8 w-8 mx-auto text-green-600 mb-2" /><p className="text-2xl font-bold">{todayViews.toLocaleString('ar')}</p><p className="text-sm text-muted-foreground">زيارات اليوم</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><MessageSquare className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">{suggestionsCount.toLocaleString('ar')}</p><p className="text-sm text-muted-foreground">الاقتراحات</p></CardContent></Card>
      </div>

      {/* Daily Views Chart */}
      <Card>
        <CardHeader><CardTitle>الزيارات اليومية (آخر 14 يوم)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} name="الزيارات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Page Stats */}
        <Card>
          <CardHeader><CardTitle>أكثر الصفحات زيارة</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pageStats.map(s => (
              <div key={s.page} className="space-y-1">
                <div className="flex justify-between text-sm"><span>{s.page}</span><span className="text-muted-foreground">{s.views} زيارة</span></div>
                <Progress value={(s.views / maxViews) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle>توزيع الزيارات</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pageStats} dataKey="views" nameKey="page" cx="50%" cy="50%" outerRadius={80} label={({ page, percent }) => `${page} ${(percent * 100).toFixed(0)}%`}>
                    {pageStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
