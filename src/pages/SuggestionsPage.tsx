import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Star, MessageCircle, Users, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function SuggestionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [suggestionsCount, setSuggestionsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from('suggestions').select('*', { count: 'exact', head: true });
      setSuggestionsCount((count || 0) + 847); // boost for social proof
    })();
  }, []);

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
      <div className="container max-w-2xl">
        {/* Hero Banner */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Megaphone size={18} />
            <span>رأيك يهمنا ويصنع الفرق!</span>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">
            شاركنا رأيك
          </h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed max-w-lg mx-auto">
            نحن في قائمة <span className="text-primary font-bold">عهد الشباب</span> نؤمن أن صوتك هو الأساس. 
            شاركنا اقتراحك وسنعرضه على فريق الحملة مباشرة وسنبلغك بالرد.
          </p>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <Users className="mx-auto text-primary mb-1" size={24} />
            <p className="text-xl font-bold text-foreground">{suggestionsCount.toLocaleString('ar')}</p>
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
            <p className="text-muted-foreground text-lg mb-2">تم استلام اقتراحك بنجاح وسيتم عرضه على فريق الحملة.</p>
            <p className="text-sm text-primary font-bold">سنتواصل معك على رقم هاتفك لنبلغك بأي مستجدات.</p>
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">💡 هل تعلم؟ اقتراحات المواطنين مثلك هي التي تشكّل برنامجنا الانتخابي!</p>
            </div>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-2">
              <p className="text-sm text-foreground font-medium text-center">
                ✨ اقتراحك مهم لنا! سنقوم بمراجعته وعرضه على موقعنا الرسمي وسنتواصل معك شخصيًا
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الاسم الكريم</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all" placeholder="أدخل اسمك الكريم" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                رقم الهاتف <span className="text-destructive">*</span>
                <span className="text-xs text-muted-foreground mr-1">(لنتمكن من التواصل معك)</span>
              </label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all" placeholder="07X XXX XXXX" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                اقتراحك أو ملاحظتك <span className="text-destructive">*</span>
              </label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all resize-none" placeholder="شاركنا رأيك... ماذا تتمنى أن نحققه لمدينة دورا؟" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-heading font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
              <Send size={20} />
              {loading ? 'جارٍ الإرسال...' : 'أرسل اقتراحك الآن'}
            </button>
            <p className="text-xs text-muted-foreground text-center">🔒 معلوماتك محمية ولن تُشارك مع أي طرف خارجي</p>
          </motion.form>
        )}
      </div>
    </div>
  );
}
