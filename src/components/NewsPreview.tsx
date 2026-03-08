import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem { id: string; title: string; content: string; category: string; published_at: string; image_url: string | null; }

export default function NewsPreview() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase.from('news').select('*').order('published_at', { ascending: false }).limit(3).then(({ data }) => {
      setNews((data as NewsItem[]) || []);
    });
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">أخبار الحملة</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <Link to={`/news/${n.id}`} key={n.id}>
              <motion.article className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all h-full" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                  {n.image_url ? (
                    <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                  ) : (
                    <Newspaper className="text-muted-foreground" size={40} />
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs text-secondary font-medium">{n.published_at}</span>
                  <h3 className="font-heading font-bold text-foreground mt-1 mb-2">{n.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{n.content}</p>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/news" className="text-secondary hover:underline font-medium">عرض جميع الأخبار ←</Link>
        </div>
      </div>
    </section>
  );
}
