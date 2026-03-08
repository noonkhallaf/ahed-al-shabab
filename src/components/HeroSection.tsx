import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function HeroSection() {
  const { data: settings } = useSiteSettings();

  const title = settings?.heroTitle || "قائمة عهد الشباب";
  const subtitle = settings?.heroSubtitle || "نحن فريق من شباب مدينة دورا الطموح، نسعى لخدمة المجتمع وتحقيق تطلعات أبناء المدينة من خلال العمل الجاد والرؤية الواضحة.";

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-32 md:py-40">
        <div className="flex flex-col items-center text-center gap-8">
          <motion.div
            className="bg-primary-foreground/95 rounded-2xl p-4 md:p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <img src={logo} alt="شعار قائمة عهد الشباب" className="h-28 md:h-40 w-auto" />
          </motion.div>

          <motion.h1
            className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {title.includes('–') ? (
              <>
                {title.split('–')[0]}
                <span className="block text-secondary mt-2">{title.split('–')[1]}</span>
              </>
            ) : (
              <>
                قائمة عهد الشباب
                <span className="block text-secondary mt-2">معًا نحو مستقبل أفضل</span>
              </>
            )}
          </motion.h1>

          <motion.p
            className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/candidates" className="px-8 py-4 rounded-lg bg-secondary text-secondary-foreground font-heading font-bold text-lg hover:brightness-110 transition-all shadow-lg hover:shadow-xl">
              تعرّف على المرشحين
            </Link>
            <Link to="/program" className="px-8 py-4 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-heading font-bold text-lg hover:bg-primary-foreground/10 transition-all">
              البرنامج الانتخابي
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-primary-foreground/40" size={32} />
        </motion.div>
      </div>
    </section>
  );
}
