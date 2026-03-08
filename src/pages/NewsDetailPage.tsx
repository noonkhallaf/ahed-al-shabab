import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Newspaper, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at: string;
  image_url: string | null;
  video_url: string | null;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('news').select('*').eq('id', id).single().then(({ data }) => {
      setNews(data as NewsItem);
      setLoading(false);
    });
  }, [id]);

  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) return <div className="pt-24 pb-20 min-h-screen flex items-center justify-center text-muted-foreground">جارٍ التحميل...</div>;
  if (!news) return <div className="pt-24 pb-20 min-h-screen flex items-center justify-center text-muted-foreground">الخبر غير موجود</div>;

  const youtubeEmbed = news.video_url ? getYoutubeEmbed(news.video_url) : null;

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-3xl">
        <Link to="/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowRight size={16} /> العودة للأخبار
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {news.image_url && (
            <div className="rounded-xl overflow-hidden mb-6">
              <img src={news.image_url} alt={news.title} className="w-full max-h-96 object-cover" />
            </div>
          )}

          {youtubeEmbed && (
            <div className="rounded-xl overflow-hidden mb-6 aspect-video">
              <iframe src={youtubeEmbed} className="w-full h-full" allowFullScreen />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary font-medium">{news.category}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} /> {news.published_at}
            </span>
          </div>

          <h1 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-6">{news.title}</h1>

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
