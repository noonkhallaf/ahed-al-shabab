import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCandidates } from "@/hooks/useCandidates";
import { trackCandidateClick } from "@/lib/candidate-tracking";

export default function CandidatesPreview() {
  const { data: candidates = [], isLoading } = useCandidates();

  if (isLoading) return null;

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
            فريق من {candidates.length} شابًا وشابة يمثلون صوت الجيل الجديد
          </p>
        </motion.div>

        <Carousel
          opts={{ align: "start", loop: true, direction: "rtl" }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {candidates.map((c, i) => (
              <CarouselItem key={c.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <motion.div
                  className="glass-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/candidates/${c.id}`} onClick={() => trackCandidateClick(c.id, 'preview')} className="block h-48 flex items-center justify-center p-4 cursor-pointer">
                    <div className="w-32 h-32 rounded-full border-4 border-secondary shadow-lg overflow-hidden flex items-center justify-center bg-muted group-hover:scale-105 transition-transform">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-muted-foreground" size={48} />
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/candidates/${c.id}`} onClick={() => trackCandidateClick(c.id, 'preview')} className="block">
                      <h3 className="font-heading font-bold text-lg text-foreground hover:text-secondary transition-colors">{c.name}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mt-1">{c.specialty} • {c.age} سنة</p>
                    <Link
                      to={`/candidates/${c.id}`}
                      className="inline-block mt-4 text-sm font-medium text-secondary hover:underline"
                    >
                      عرض الملف الكامل ←
                    </Link>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="text-center mt-10">
          <Link
            to="/candidates"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all shadow-md"
          >
            عرض جميع المرشحين ({candidates.length})
          </Link>
        </div>
      </div>
    </section>
  );
}
