import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { name: "أبو محمد", text: "قائمة عهد الشباب تمثل الأمل الحقيقي لمستقبل أبنائنا. برنامجهم واقعي وطموح." },
  { name: "أم سارة", text: "أعجبني تنوع المرشحين وتخصصاتهم. نحتاج شبابًا بهذه الكفاءة في مجتمعنا." },
  { name: "خالد العمري", text: "لأول مرة أشعر أن هناك قائمة تتحدث بلسان الشباب وتفهم تطلعاتهم الحقيقية." },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">آراء الداعمين</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Quote className="text-secondary mb-3" size={24} />
              <p className="text-foreground leading-relaxed mb-4">"{t.text}"</p>
              <p className="text-muted-foreground text-sm font-medium">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
