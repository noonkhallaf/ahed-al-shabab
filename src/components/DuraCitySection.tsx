import { motion } from "framer-motion";
import { MapPin, Landmark, Users, TreePine } from "lucide-react";
import duraCity from "@/assets/dura-city.jpg";

const highlights = [
  { icon: Landmark, title: "تاريخ عريق", desc: "مدينة ضاربة في جذور التاريخ، شهدت حضارات عديدة وتحمل إرثًا ثقافيًا غنيًا." },
  { icon: Users, title: "أهل كرام", desc: "يتميز أبناء دورا بالكرم والعطاء والتكافل الاجتماعي الذي يجمعهم كعائلة واحدة." },
  { icon: TreePine, title: "طبيعة خلابة", desc: "تحيط بها التلال الخضراء وأشجار الزيتون والمناظر الطبيعية الساحرة." },
  { icon: MapPin, title: "موقع مميز", desc: "تقع جنوب الخليل وتُعد من أكبر مدن المحافظة وأكثرها حيوية ونشاطًا." },
];

export default function DuraCitySection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            مدينة <span className="text-secondary">دورا</span> .. فخرنا وانتماؤنا
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={duraCity}
              alt="مدينة دورا - فلسطين"
              className="w-full h-[350px] md:h-[450px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-6 right-6 left-6 text-primary-foreground">
              <p className="font-heading font-bold text-xl">مدينة دورا</p>
              <p className="text-primary-foreground/80 text-sm">محافظة الخليل - فلسطين</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              مدينة دورا، بتاريخها العريق وأهلها الكرام، كانت دائمًا نموذجًا للعطاء والعمل المجتمعي.
              واليوم يأتي دور الشباب ليواصلوا المسيرة ويبادروا نحو مستقبل أفضل يخدم جميع أبناء المدينة.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              نحن في قائمة عهد الشباب نؤمن بأن دورا تستحق الأفضل، ونعمل بكل شغف لنكون على قدر المسؤولية
              في خدمة هذه المدينة العظيمة وأهلها الطيبين.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                    <h.icon className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground text-sm">{h.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">{h.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
