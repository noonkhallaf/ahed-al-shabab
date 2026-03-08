import { motion } from "framer-motion";
import { Eye, Users, MessageSquare, ThumbsUp } from "lucide-react";

const stats = [
  { icon: Eye, label: "زيارة للموقع", value: "١٢,٤٥٠+", color: "text-secondary" },
  { icon: Users, label: "داعم ومؤيد", value: "٤,٨٠٠+", color: "text-primary" },
  { icon: MessageSquare, label: "اقتراح من المواطنين", value: "١,٢٣٠+", color: "text-secondary" },
  { icon: ThumbsUp, label: "نسبة الرضا", value: "٩٧٪", color: "text-primary" },
];

export default function SocialProofSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <s.icon className={`mx-auto mb-2 ${s.color}`} size={32} />
              <p className="font-heading font-bold text-2xl md:text-3xl text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
