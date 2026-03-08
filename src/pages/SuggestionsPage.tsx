import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export default function SuggestionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">اقتراحاتكم</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4">نرحب بجميع اقتراحاتكم وملاحظاتكم</p>
        </motion.div>

        {submitted ? (
          <motion.div className="glass-card rounded-xl p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle className="text-secondary mx-auto mb-4" size={48} />
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">تم إرسال اقتراحكم بنجاح</h2>
            <p className="text-muted-foreground">شكرًا لمشاركتكم. سنأخذ اقتراحكم بعين الاعتبار.</p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-8 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الاسم (اختياري)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                placeholder="أدخل اسمك"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">رقم الهاتف</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                placeholder="07X XXX XXXX"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الرسالة</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all resize-none"
                placeholder="اكتب اقتراحك أو ملاحظتك هنا..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              إرسال الاقتراح
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
