import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { candidatesData } from "@/data/candidates";
import { User } from "lucide-react";

export default function CandidatesPreview() {
  const preview = candidatesData.slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            مرشحونا
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            فريق من 13 شابًا وشابة يمثلون صوت الجيل الجديد
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview.map((c, i) => (
            <motion.div
              key={c.id}
              className="glass-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-48 bg-muted flex items-center justify-center">
                <User className="text-muted-foreground" size={64} />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-foreground">{c.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{c.specialty} • {c.age} سنة</p>
                <Link
                  to={`/candidates/${c.id}`}
                  className="inline-block mt-4 text-sm font-medium text-secondary hover:underline"
                >
                  عرض الملف الكامل ←
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/candidates"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all shadow-md"
          >
            عرض جميع المرشحين (13)
          </Link>
        </div>
      </div>
    </section>
  );
}
