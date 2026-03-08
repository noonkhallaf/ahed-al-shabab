import { motion } from "framer-motion";
import { Newspaper, Calendar, Video, Image } from "lucide-react";

const allNews = [
  { title: "لقاء تعريفي مع أهالي الحي الشرقي", date: "5 مارس 2026", type: "لقاء", icon: Calendar, desc: "عقد مرشحو القائمة لقاءً مفتوحًا مع أهالي الحي الشرقي لعرض البرنامج الانتخابي والاستماع لمطالبهم ومقترحاتهم." },
  { title: "حملة تنظيف شاملة في المنطقة", date: "3 مارس 2026", type: "فعالية", icon: Newspaper, desc: "نظمت القائمة حملة تنظيف شاملة بمشاركة أكثر من 100 متطوع من شباب المنطقة لتحسين المظهر العام." },
  { title: "ورشة عمل حول تمكين الشباب", date: "1 مارس 2026", type: "ورشة", icon: Video, desc: "ورشة عمل متخصصة ناقشت فرص تمكين الشباب وتوفير بيئة داعمة لمشاريعهم الريادية." },
  { title: "زيارة ميدانية للمدارس المحلية", date: "27 فبراير 2026", type: "زيارة", icon: Image, desc: "قام المرشحون بزيارة ميدانية للمدارس المحلية للاطلاع على احتياجاتها وتقديم الدعم." },
  { title: "إطلاق الحملة الانتخابية رسميًا", date: "25 فبراير 2026", type: "خبر", icon: Newspaper, desc: "تم إطلاق الحملة الانتخابية لقائمة عهد الشباب رسميًا في حفل حضره المئات من أبناء المجتمع." },
  { title: "فيديو تعريفي بالبرنامج الانتخابي", date: "23 فبراير 2026", type: "فيديو", icon: Video, desc: "نشر فيديو تعريفي يشرح أهم محاور البرنامج الانتخابي ورؤية القائمة للمستقبل." },
];

export default function NewsPage() {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">أخبار الحملة</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map((n, i) => (
            <motion.article
              key={i}
              className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="h-40 bg-muted flex items-center justify-center">
                <n.icon className="text-muted-foreground" size={40} />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary font-medium">{n.type}</span>
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{n.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{n.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
