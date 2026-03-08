import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Play, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
  category: string | null;
  created_at: string;
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });
      setMedia((data as MediaItem[]) || []);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">
            معرض الحملة
          </h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            شاهد صور وفيديوهات من نشاطات الحملة والفعاليات
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-primary" size={40} />
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">لا توجد صور أو فيديوهات حتى الآن</p>
          </div>
        ) : (
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="images">
                الصور ({images.length})
              </TabsTrigger>
              <TabsTrigger value="videos">
                الفيديوهات ({videos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images">
              {images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  لا توجد صور
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img, i) => (
                    <motion.div
                      key={img.id}
                      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedImage(img)}
                    >
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-foreground line-clamp-1">
                          {img.title}
                        </h3>
                        {img.category && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {img.category}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos">
              {videos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  لا توجد فيديوهات
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, i) => {
                    const youtubeEmbed = getYoutubeEmbed(video.url);
                    return (
                      <motion.div
                        key={video.id}
                        className="glass-card rounded-xl overflow-hidden group hover:shadow-xl transition-all"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {youtubeEmbed ? (
                            <iframe
                              src={youtubeEmbed}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/20 relative">
                              <video
                                src={video.url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-heading font-bold text-foreground line-clamp-2">
                            {video.title}
                          </h3>
                          {video.category && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {video.category}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-muted overflow-hidden flex-1">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 bg-card">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {selectedImage.title}
              </h3>
              {selectedImage.category && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedImage.category}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
