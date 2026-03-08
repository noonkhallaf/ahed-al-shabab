import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function JoinSection() {
  return (
    <section className="py-20 gradient-hero">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <UserPlus className="text-secondary mx-auto mb-4" size={48} />
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
            انضم إلى حملتنا
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            كن جزءًا من التغيير! انضم إلينا وساهم في بناء مستقبل أفضل لمجتمعنا.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 rounded-lg bg-secondary text-secondary-foreground font-heading font-bold text-lg hover:brightness-110 transition-all shadow-lg"
          >
            تواصل معنا الآن
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
