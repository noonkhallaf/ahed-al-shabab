import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const news = [
  { title: "لقاء تعريفي مع أهالي الحي الشرقي", date: "5 مارس 2026", desc: "عقد مرشحو القائمة لقاءً مفتوحًا مع أهالي الحي الشرقي لعرض البرنامج الانتخابي والاستماع لمطالبهم." },
  { title: "حملة تنظيف شاملة في المنطقة", date: "3 مارس 2026", desc: "نثمت القائمة حملة تنظيف شاملة بمشاركة أكثر من 100 متطوع من شباب المنطقة." },
  { title: "ورشة عمل حول تمكين الشباب", date: "1 مارس 2026", desc: "ورشة عمل متخصصة ناقشت فرص تمكين الشباب وتوفير بيئة داعمة لمشاريعهم." },
];

export default function NewsPreview() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">أخبار الحملة</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <motion.article
              key={i}
              className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-40 bg-muted flex items-center justify-center">
                <Newspaper className="text-muted-foreground" size={40} />
              </div>
              <div className="p-5">
                <span className="text-xs text-secondary font-medium">{n.date}</span>
                <h3 className="font-heading font-bold text-foreground mt-1 mb-2">{n.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{n.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
