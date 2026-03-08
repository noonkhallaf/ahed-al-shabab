import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { candidatesData } from "@/data/candidates";
import { User } from "lucide-react";

export default function CandidatesPage() {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">مرشحونا الـ 13</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">تعرّف على فريق عهد الشباب الذي يسعى لخدمة مجتمعك</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {candidatesData.map((c, i) => (
            <motion.div
              key={c.id}
              className="glass-card rounded-xl overflow-hidden group hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="h-48 bg-muted flex items-center justify-center">
                <User className="text-muted-foreground" size={64} />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-foreground">{c.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{c.specialty}</p>
                <p className="text-muted-foreground text-sm">{c.age} سنة • {c.education}</p>
                <Link
                  to={`/candidates/${c.id}`}
                  className="inline-block mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
