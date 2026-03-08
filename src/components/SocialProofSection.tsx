import { motion } from "framer-motion";
import { Eye, Users, MessageSquare, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SocialProofSection() {
  const [visitorBoost, setVisitorBoost] = useState(12450);
  const [supporterBoost, setSupporterBoost] = useState(4800);
  const [suggestionsCount, setSuggestionsCount] = useState(0);
  const [suggestionsBoost, setSuggestionsBoost] = useState(847);

  useEffect(() => {
    const loadStats = async () => {
      const [{ data: settings }, { count }] = await Promise.all([
        supabase.from('site_settings').select('key, value'),
        supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('is_approved', true),
      ]);

      if (settings) {
        const map: Record<string, string> = {};
        settings.forEach(s => { if (s.value) map[s.key] = s.value; });
        if (map.suggestionsBoost) setSuggestionsBoost(Number(map.suggestionsBoost));
        if (map.visitorBoost) setVisitorBoost(Number(map.visitorBoost));
        if (map.supporterBoost) setSupporterBoost(Number(map.supporterBoost));
      }
      setSuggestionsCount((count || 0) + suggestionsBoost);
    };
    loadStats();
  }, []);

  const stats = [
    { icon: Eye, label: "زيارة للموقع", value: visitorBoost.toLocaleString('ar') + "+", color: "text-secondary" },
    { icon: Users, label: "داعم ومؤيد", value: supporterBoost.toLocaleString('ar') + "+", color: "text-primary" },
    { icon: MessageSquare, label: "اقتراح من المواطنين", value: suggestionsCount.toLocaleString('ar') + "+", color: "text-secondary" },
    { icon: ThumbsUp, label: "نسبة الرضا", value: "٩٧٪", color: "text-primary" },
  ];

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
