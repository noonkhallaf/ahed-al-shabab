import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem { id: string; title: string; content: string; category: string; published_at: string; }

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('news').select('*').order('published_at', { ascending: false }).then(({ data }) => {
      setNews((data as NewsItem[]) || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">أخبار الحملة</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>
        {loading ? (
          <div className="text-center text-muted-foreground py-12">جارٍ التحميل...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n, i) => (
              <motion.article key={n.id} className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="h-40 bg-muted flex items-center justify-center">
                  <Newspaper className="text-muted-foreground" size={40} />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary font-medium">{n.category}</span>
                    <span className="text-xs text-muted-foreground">{n.published_at}</span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2">{n.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{n.content}</p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
