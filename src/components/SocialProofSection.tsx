import { motion } from "framer-motion";
import { Eye, Users, MessageSquare, ThumbsUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target <= 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

export default function SocialProofSection() {
  const [visitorBoost, setVisitorBoost] = useState(12450);
  const [supporterBoost, setSupporterBoost] = useState(4800);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalSuggestions, setTotalSuggestions] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const [{ data: settings }, { count: pageViewCount }, { count: suggestionsCount }] = await Promise.all([
        supabase.from('site_settings').select('key, value'),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('is_approved', true),
      ]);

      let vBoost = 12450, sBoost = 4800, sgBoost = 847;
      if (settings) {
        const map: Record<string, string> = {};
        settings.forEach(s => { if (s.value) map[s.key] = s.value; });
        if (map.visitorBoost) vBoost = Number(map.visitorBoost);
        if (map.supporterBoost) sBoost = Number(map.supporterBoost);
        if (map.suggestionsBoost) sgBoost = Number(map.suggestionsBoost);
      }
      setVisitorBoost(vBoost);
      setSupporterBoost(sBoost);
      setTotalVisitors(vBoost + (pageViewCount || 0));
      setTotalSuggestions(sgBoost + (suggestionsCount || 0));
    };
    loadStats();
  }, []);

  const visitors = useCountUp(totalVisitors);
  const supporters = useCountUp(supporterBoost);
  const suggestions = useCountUp(totalSuggestions);

  const stats = [
    { icon: Eye, label: "زيارة للموقع", displayValue: visitors.value.toLocaleString('ar') + "+", ref: visitors.ref, color: "text-secondary" },
    { icon: Users, label: "داعم ومؤيد", displayValue: supporters.value.toLocaleString('ar') + "+", ref: supporters.ref, color: "text-primary" },
    { icon: MessageSquare, label: "اقتراح من المواطنين", displayValue: suggestions.value.toLocaleString('ar') + "+", ref: suggestions.ref, color: "text-secondary" },
    { icon: ThumbsUp, label: "نسبة الرضا", displayValue: "٩٧٪", ref: null, color: "text-primary" },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              ref={s.ref}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <s.icon className={`mx-auto mb-2 ${s.color}`} size={32} />
              <p className="font-heading font-bold text-2xl md:text-3xl text-foreground">{s.displayValue}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
