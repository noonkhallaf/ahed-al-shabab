import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, GraduationCap, Briefcase, Award, Quote, ArrowRight, Share2, Image } from "lucide-react";
import { useCandidate } from "@/hooks/useCandidates";
import CandidateShareCard from "@/components/CandidateShareCard";
import { Button } from "@/components/ui/button";

export default function CandidateDetailPage() {
  const { id } = useParams();
  const { data: candidate, isLoading } = useCandidate(Number(id));

  if (isLoading) {
    return <div className="pt-32 text-center min-h-screen"><p className="text-muted-foreground">جارٍ التحميل...</p></div>;
  }

  if (!candidate) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <p className="text-xl text-muted-foreground">لم يتم العثور على المرشح</p>
        <Link to="/candidates" className="text-secondary mt-4 inline-block">العودة للمرشحين</Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `تعرّف على ${candidate.name} من قائمة عهد الشباب`;

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-4xl">
        <Link to="/candidates" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowRight size={16} />
          العودة لجميع المرشحين
        </Link>

        <motion.div className="glass-card rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="gradient-hero p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-secondary overflow-hidden flex items-center justify-center bg-primary-foreground/10">
              {candidate.image_url ? (
                <img src={candidate.image_url} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                <User className="text-primary-foreground" size={64} />
              )}
            </div>
            <div className="text-center md:text-right">
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground">{candidate.name}</h1>
              <p className="text-secondary font-medium text-lg mt-2">{candidate.specialty}</p>
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-primary-foreground/70 text-sm">
                <span className="flex items-center gap-1"><MapPin size={14} />{candidate.location}</span>
                <span className="flex items-center gap-1"><GraduationCap size={14} />{candidate.education}</span>
                <span>{candidate.age} سنة</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <div className="bg-muted/50 rounded-xl p-6 border-r-4 border-secondary">
              <Quote className="text-secondary mb-2" size={24} />
              <p className="font-heading text-lg text-foreground italic">"{candidate.quote}"</p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-3">نبذة شخصية</h2>
              <p className="text-muted-foreground leading-relaxed">{candidate.bio}</p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                <Briefcase size={20} className="text-secondary" /> الخبرات
              </h2>
              <ul className="space-y-2">
                {candidate.experience.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                <Award size={20} className="text-secondary" /> الإنجازات
              </h2>
              <ul className="space-y-2">
                {candidate.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                <Share2 size={18} /> شارك هذه الصفحة
              </h3>
              <div className="flex flex-wrap gap-3">
                <CandidateShareCard
                  candidate={candidate}
                  trigger={
                    <Button variant="outline" className="gap-2">
                      <Image size={16} />
                      مشاركة بطاقة المرشح
                    </Button>
                  }
                />
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-lg bg-[#1877F2] text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">فيسبوك</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-lg bg-[#25D366] text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">واتساب</a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-lg bg-[#0088cc] text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">تيليجرام</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
