import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, MessageCircle } from "lucide-react";

export default function JoinSection() {
  return (
    <section className="py-20 gradient-hero">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Lightbulb className="text-secondary mx-auto mb-4" size={48} />
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
            عندك فكرة؟ شاركنا إياها! 💡
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-4">
            المساحة مفتوحة لكل الأفكار والاقتراحات. لا تتردد... كل فكرة مهما كانت بسيطة قد تصنع الفرق!
          </p>
          <p className="text-primary-foreground/50 max-w-md mx-auto mb-8 text-sm">
            نتقبّل كل شيء بصدر رحب: اقتراحات، أفكار، ملاحظات، وحتى أحلام لمستقبل مدينتنا ❤️
          </p>
          <Link
            to="/suggestions"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-secondary text-secondary-foreground font-heading font-bold text-lg hover:brightness-110 transition-all shadow-lg"
          >
            <MessageCircle size={22} />
            شارك اقتراحك الآن
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
