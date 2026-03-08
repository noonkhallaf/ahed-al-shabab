import { motion } from "framer-motion";
import { GraduationCap, Heart, Trophy, Users, Wrench } from "lucide-react";

const programs = [
  { icon: Users, title: "دعم الشباب", desc: "تمكين الشباب وتوفير فرص عمل وتدريب ومنح دراسية لبناء جيل قادر على القيادة." },
  { icon: GraduationCap, title: "تطوير التعليم", desc: "تحسين المناهج التعليمية وتوفير بيئة تعليمية حديثة ومتطورة." },
  { icon: Trophy, title: "دعم الرياضة", desc: "إنشاء مرافق رياضية وتنظيم بطولات ودعم المواهب الرياضية الشابة." },
  { icon: Heart, title: "العمل المجتمعي", desc: "تعزيز التكافل الاجتماعي ودعم الأسر المحتاجة وبناء مجتمع متماسك." },
  { icon: Wrench, title: "تطوير الخدمات", desc: "تحسين البنية التحتية والخدمات العامة لتلبية احتياجات المواطنين." },
];

export default function ProgramPreview() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            البرنامج الانتخابي
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              className="glass-card rounded-xl p-6 text-center hover:shadow-xl transition-all group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-colors">
                <p.icon className="text-secondary" size={28} />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
