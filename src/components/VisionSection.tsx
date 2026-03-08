import { motion } from "framer-motion";
import { Target, Users, Building, HandHeart } from "lucide-react";

const pillars = [
  { icon: Users, title: "دور الشباب", desc: "تمكين الشباب ليكونوا صناع القرار والمبادرين في تطوير المدينة وخدمة أهلها." },
  { icon: HandHeart, title: "خدمة المجتمع", desc: "تعزيز التكافل الاجتماعي والعمل التطوعي لبناء مجتمع متماسك ومتعاون." },
  { icon: Building, title: "تطوير الخدمات البلدية", desc: "تحسين البنية التحتية والخدمات العامة لتلبية تطلعات المواطنين." },
  { icon: Target, title: "المشاركة المجتمعية", desc: "إشراك جميع أبناء المدينة في صنع القرار والتخطيط لمستقبل أفضل." },
];

export default function VisionSection() {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground">
            رؤيتنا لمدينة <span className="text-secondary">دورا</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-primary-foreground/70 mt-4 max-w-2xl mx-auto text-lg">
            نؤمن بأن الشباب هم عماد التغيير، ونسعى لنكون جسرًا بين تطلعات المجتمع والعمل الفعلي على أرض الواقع.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <p.icon className="text-secondary" size={28} />
              </div>
              <h3 className="font-heading font-bold text-primary-foreground text-lg mb-2">{p.title}</h3>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          className="mt-14 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-secondary font-heading text-xl md:text-2xl font-bold italic leading-relaxed">
            "عهدنا لأبناء دورا أن نكون صوتهم وأيديهم العاملة، وأن نضع مصلحة المدينة فوق كل اعتبار."
          </p>
          <span className="text-primary-foreground/50 text-sm mt-3 block">— قائمة عهد الشباب</span>
        </motion.blockquote>
      </div>
    </section>
  );
}
