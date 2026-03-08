import { motion } from "framer-motion";
import { GraduationCap, Heart, Trophy, Users, Wrench, Target } from "lucide-react";

const sections = [
  { icon: Users, title: "الشباب", color: "bg-blue-500/10 text-blue-600", items: ["توفير فرص تدريب وتأهيل مهني", "دعم المشاريع الريادية الشبابية", "إنشاء مراكز شبابية حديثة", "برامج تبادل ثقافي وتعليمي"] },
  { icon: GraduationCap, title: "التعليم", color: "bg-emerald-500/10 text-emerald-600", items: ["تطوير المناهج التعليمية", "توفير منح دراسية للمتفوقين", "دعم التعليم التقني والمهني", "تحسين البيئة التعليمية"] },
  { icon: Heart, title: "المجتمع", color: "bg-rose-500/10 text-rose-600", items: ["تعزيز التكافل الاجتماعي", "دعم الأسر المحتاجة", "برامج تطوعية مجتمعية", "رعاية كبار السن والأيتام"] },
  { icon: Trophy, title: "الرياضة", color: "bg-amber-500/10 text-amber-600", items: ["إنشاء ملاعب ومرافق رياضية", "تنظيم بطولات ومسابقات", "دعم المواهب الرياضية", "أندية رياضية للشباب والنساء"] },
  { icon: Wrench, title: "الخدمات", color: "bg-purple-500/10 text-purple-600", items: ["تحسين البنية التحتية", "رقمنة الخدمات الحكومية", "تطوير شبكات الطرق", "تحسين خدمات النظافة والبيئة"] },
  { icon: Target, title: "الحوكمة", color: "bg-teal-500/10 text-teal-600", items: ["الشفافية في العمل", "المساءلة والمحاسبة", "إشراك المواطنين في القرارات", "تقارير دورية عن الإنجازات"] },
];

export default function ProgramPage() {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">البرنامج الانتخابي</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">رؤيتنا الشاملة لبناء مجتمع أفضل من خلال محاور عمل واضحة وقابلة للتنفيذ</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              className="glass-card rounded-xl p-8 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                <s.icon size={28} />
              </div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-4">{s.title}</h2>
              <ul className="space-y-3">
                {s.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
