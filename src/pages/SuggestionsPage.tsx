import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Star, MessageCircle, Users, Megaphone, Heart, Shield, Lightbulb, MessageSquareReply } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface Suggestion {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
  is_approved: boolean;
  admin_reply: string | null;
}

export default function SuggestionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [approvedSuggestions, setApprovedSuggestions] = useState<Suggestion[]>([]);
  const { data: settings } = useSiteSettings();

  const fakeBoost = parseInt(settings?.suggestionsBoost || '847');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('suggestions')
        .select('id, name, message, created_at, is_approved, admin_reply')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      setApprovedSuggestions((data as Suggestion[]) || []);
    })();
  }, []);

  const totalCount = approvedSuggestions.length + fakeBoost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || !form.phone.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('suggestions').insert({
      name: form.name || null,
      phone: form.phone,
      message: form.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'حدث خطأ، حاول مرة أخرى', variant: 'destructive' });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-4xl">
        {/* Hero Banner */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Megaphone size={18} />
            <span>المساحة مفتوحة... اكتب ما يحلو لك!</span>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">
            صوتك يصنع الفرق 🗣️
          </h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed max-w-lg mx-auto">
            هنا مساحتك الحرة! اكتب اقتراحك، فكرتك، حلمك، أو حتى شكواك.
            <span className="text-primary font-bold"> نتقبّل كل شيء بصدر رحب لأجل بلدنا ❤️</span>
          </p>
        </motion.div>

        {/* Encouragement Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="glass-card rounded-xl p-5 text-center">
            <Shield className="mx-auto text-green-600 mb-2" size={28} />
            <p className="font-bold text-foreground text-sm">خصوصيتك محمية</p>
            <p className="text-xs text-muted-foreground mt-1">رقم هاتفك لن يظهر للعامة أبداً</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <Lightbulb className="mx-auto text-secondary mb-2" size={28} />
            <p className="font-bold text-foreground text-sm">كل فكرة مرحب بها</p>
            <p className="text-xs text-muted-foreground mt-1">لا توجد فكرة صغيرة أو كبيرة</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <Heart className="mx-auto text-red-500 mb-2" size={28} />
            <p className="font-bold text-foreground text-sm">نقرأ كل اقتراح</p>
            <p className="text-xs text-muted-foreground mt-1">ونرد عليك شخصياً</p>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <Users className="mx-auto text-primary mb-1" size={24} />
            <p className="text-xl font-bold text-foreground">{totalCount.toLocaleString('ar')}</p>
            <p className="text-xs text-muted-foreground">مشاركة حتى الآن</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Star className="mx-auto text-secondary mb-1" size={24} />
            <p className="text-xl font-bold text-foreground">٩٨٪</p>
            <p className="text-xs text-muted-foreground">نسبة الاستجابة</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <MessageCircle className="mx-auto text-primary mb-1" size={24} />
            <p className="text-xl font-bold text-foreground">٢٤ ساعة</p>
            <p className="text-xs text-muted-foreground">متوسط وقت الرد</p>
          </div>
        </motion.div>

        {submitted ? (
          <motion.div className="glass-card rounded-xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle className="text-secondary mx-auto mb-4" size={56} />
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">شكرًا لمشاركتك! 🎉</h2>
            <p className="text-muted-foreground text-lg mb-2">تم استلام اقتراحك بنجاح وسيتم مراجعته ونشره على الموقع.</p>
            <p className="text-sm text-primary font-bold">سنتواصل معك على رقم هاتفك لنبلغك بأي مستجدات.</p>
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">💡 اقتراحات المواطنين مثلك هي التي تشكّل برنامجنا الانتخابي!</p>
            </div>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-5 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-2">
              <p className="text-sm text-foreground font-medium text-center">
                ✨ لا تخف ولا تتردد! المساحة مفتوحة لكل الأفكار والاقتراحات. اكتب بحرية تامة وسنتعامل مع كل اقتراح باهتمام ❤️
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">اسمك (اختياري)</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all" placeholder="يمكنك ترك هذا الحقل فارغاً إن أردت" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                رقم الهاتف <span className="text-destructive">*</span>
                <span className="text-xs text-muted-foreground mr-1">(لن يظهر للعامة - فقط للتواصل معك)</span>
              </label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all" placeholder="07X XXX XXXX" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                اكتب ما يحلو لك! <span className="text-destructive">*</span>
              </label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all resize-none" placeholder="اقتراح، فكرة، ملاحظة، حلم... كل شيء مرحب به! 💡" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-heading font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
              <Send size={20} />
              {loading ? 'جارٍ الإرسال...' : 'أرسل اقتراحك الآن'}
            </button>
            <p className="text-xs text-muted-foreground text-center">🔒 رقم هاتفك محمي ولن يظهر على الموقع أبداً</p>
          </motion.form>
        )}

        {/* Approved Suggestions Wall */}
        {approvedSuggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-6">
              💬 اقتراحات أبناء مدينتنا
            </h2>
            <div className="space-y-4">
              {approvedSuggestions.map((s, i) => (
                <motion.div
                  key={s.id}
                  className="glass-card rounded-xl p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-primary font-bold text-sm">{(s.name || 'م')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-foreground text-sm">{s.name || 'مواطن/ة'}</p>
                        <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString('ar')}</span>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">{s.message}</p>

                      {s.admin_reply && (
                        <div className="mt-3 p-3 bg-primary/5 border-r-4 border-primary rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageSquareReply size={14} className="text-primary" />
                            <span className="text-xs font-bold text-primary">رد فريق الحملة</span>
                          </div>
                          <p className="text-sm text-foreground">{s.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
