import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Eye, MousePointerClick, Megaphone, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface CandidateStat {
  id: number;
  name: string;
  image_url: string | null;
  clicks: number;
  promotion_priority: number;
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#e11d48', '#a855f7', '#0ea5e9'];

export default function AdminCandidateAnalytics() {
  const [stats, setStats] = useState<CandidateStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const { user } = useAdminAuth();

  const fetchStats = async () => {
    setLoading(true);
    // Get all candidates
    const { data: candidates } = await supabase
      .from('candidates')
      .select('id, name, image_url, promotion_priority')
      .order('id');

    if (!candidates) { setLoading(false); return; }

    // Get click counts per candidate
    const { data: clicks } = await supabase
      .from('candidate_clicks')
      .select('candidate_id');

    const clickMap: Record<number, number> = {};
    clicks?.forEach(c => {
      clickMap[c.candidate_id] = (clickMap[c.candidate_id] || 0) + 1;
    });

    const result: CandidateStat[] = candidates.map(c => ({
      id: c.id,
      name: c.name,
      image_url: c.image_url,
      clicks: clickMap[c.id] || 0,
      promotion_priority: c.promotion_priority ?? 0,
    }));

    // Sort by clicks desc
    result.sort((a, b) => b.clicks - a.clicks);
    setStats(result);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const togglePromotion = async (candidateId: number, currentPriority: number) => {
    const newPriority = currentPriority > 0 ? 0 : 10;
    setSaving(candidateId);
    
    const { error } = await supabase
      .from('candidates')
      .update({ promotion_priority: newPriority })
      .eq('id', candidateId);

    if (error) {
      toast({ title: 'خطأ', description: 'فشل تحديث أولوية الترويج', variant: 'destructive' });
    } else {
      toast({ title: 'تم التحديث', description: newPriority > 0 ? 'تم تفعيل الترويج الذكي لهذا المرشح' : 'تم إيقاف الترويج' });
      setStats(prev => prev.map(s => s.id === candidateId ? { ...s, promotion_priority: newPriority } : s));
      
      // Audit log
      const candidate = stats.find(s => s.id === candidateId);
      await supabase.from('audit_log').insert({
        action: newPriority > 0 ? 'تفعيل ترويج مرشح' : 'إيقاف ترويج مرشح',
        admin_username: user?.username || 'admin',
        details: `المرشح: ${candidate?.name}`,
      });
    }
    setSaving(null);
  };

  const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
  const topCandidate = stats[0];
  const promotedCount = stats.filter(s => s.promotion_priority > 0).length;

  const chartData = stats.map(s => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    clicks: s.clicks,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">تحليل تفاعل المرشحين</h2>
        <p className="text-muted-foreground">تتبع نقرات وزيارات صفحات المرشحين مع نظام الترويج الذكي</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">إجمالي النقرات</CardTitle>
            <MousePointerClick className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalClicks}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">الأكثر تفاعلاً</CardTitle>
            <Crown className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-lg font-bold truncate">{topCandidate?.name || '-'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">مرشحون مروّجون</CardTitle>
            <Megaphone className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{promotedCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">معدل النقر</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.length ? Math.round(totalClicks / stats.length) : 0}</div></CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">توزيع النقرات حسب المرشح</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ right: 100, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`${value} نقرة`, 'النقرات']} />
                <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table with Promotion Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            إدارة الترويج الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">جارٍ التحميل...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead className="text-right">المرشح</TableHead>
                  <TableHead className="text-right">النقرات</TableHead>
                  <TableHead className="text-right">النسبة</TableHead>
                  <TableHead className="text-right">الترويج الذكي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((s, i) => (
                  <TableRow key={s.id} className={s.promotion_priority > 0 ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}>
                    <TableCell className="font-bold">
                      {i === 0 && s.clicks > 0 ? <Crown className="h-5 w-5 text-yellow-500 inline" /> : i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {s.image_url ? (
                          <img src={s.image_url} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
                        )}
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{s.clicks}</TableCell>
                    <TableCell>{totalClicks > 0 ? `${Math.round((s.clicks / totalClicks) * 100)}%` : '0%'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={s.promotion_priority > 0}
                          onCheckedChange={() => togglePromotion(s.id, s.promotion_priority)}
                          disabled={saving === s.id}
                        />
                        <span className="text-xs text-muted-foreground">
                          {s.promotion_priority > 0 ? '🔥 مُفعّل' : 'متوقف'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
