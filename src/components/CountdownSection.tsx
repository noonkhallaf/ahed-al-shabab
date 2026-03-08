import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownSection() {
  const { data: settings } = useSiteSettings();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const showCountdown = settings?.countdownVisible !== 'false';
  const electionDate = new Date(settings?.countdownDate || '2026-05-15T08:00:00');

  useEffect(() => {
    setTime(getTimeLeft(electionDate));
    const interval = setInterval(() => setTime(getTimeLeft(electionDate)), 1000);
    return () => clearInterval(interval);
  }, [settings?.countdownDate]);

  if (!showCountdown) return null;

  const units = [
    { label: "يوم", value: time.days },
    { label: "ساعة", value: time.hours },
    { label: "دقيقة", value: time.minutes },
    { label: "ثانية", value: time.seconds },
  ];

  return (
    <section className="py-16 gradient-hero">
      <div className="container text-center">
        <motion.h2
          className="font-heading font-bold text-2xl md:text-3xl text-primary-foreground mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          العد التنازلي ليوم الانتخابات
        </motion.h2>
        <p className="text-primary-foreground/60 mb-8">كل صوت يصنع الفرق</p>

        <div className="flex justify-center gap-4 md:gap-8">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
                <span className="font-heading font-bold text-3xl md:text-5xl text-secondary">
                  {String(u.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-primary-foreground/70 text-sm mt-2 font-medium">{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
