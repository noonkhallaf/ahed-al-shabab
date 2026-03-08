import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ImageIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
  category: string | null;
}

export default function GalleryPreview() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      setMedia((data as MediaItem[]) || []);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
            معرض الحملة
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            شاهد لحظات حية من فعالياتنا وأنشطتنا الميدانية
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-muted-foreground">جارٍ التحميل...</div>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto text-muted-foreground/50 mb-4" size={48} />
            <p className="text-muted-foreground">المعرض قريباً...</p>
          </div>
        ) : (
          <>
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {media.map((item, i) => {
                  const youtubeEmbed = getYoutubeEmbed(item.url);
                  return (
                    <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <motion.div
                        className="glass-card rounded-xl overflow-hidden group relative h-full"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="aspect-square bg-muted relative overflow-hidden">
                          {youtubeEmbed ? (
                            <iframe src={youtubeEmbed} className="w-full h-full" allowFullScreen />
                          ) : item.type === "image" ? (
                            <img
                              src={item.url}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <video src={item.url} className="w-full h-full object-cover" />
                          )}
                          {item.type === "video" && !youtubeEmbed && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                              <Play className="text-white fill-white" size={48} />
                            </div>
                          )}
                        </div>
                        {item.category && (
                          <div className="p-3">
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        )}
                      </motion.div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>

            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/gallery">
                <Button size="lg" className="gap-2 text-base">
                  شاهد المعرض الكامل
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
