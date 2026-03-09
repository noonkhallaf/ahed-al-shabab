import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, User, MapPin, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/assets/logo.png";

interface CandidateCardData {
  name: string;
  specialty: string;
  age: number;
  education: string;
  location: string;
  quote: string;
  image_url: string | null;
}

interface Props {
  candidate: CandidateCardData;
  trigger?: React.ReactNode;
}

export default function CandidateShareCard({ candidate, trigger }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${candidate.name}-عهد-الشباب.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate card image", err);
    } finally {
      setGenerating(false);
    }
  };

  const shareCard = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${candidate.name}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: `${candidate.name} - عهد الشباب`,
            text: `تعرّف على ${candidate.name} من قائمة عهد الشباب 🇵🇸`,
            files: [file],
          });
        } else {
          // Fallback: download
          const link = document.createElement("a");
          link.download = `${candidate.name}-عهد-الشباب.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        setGenerating(false);
      });
    } catch (err) {
      console.error("Failed to share card", err);
      setGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 size={16} />
            مشاركة البطاقة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading">بطاقة المرشح للمشاركة</DialogTitle>
        </DialogHeader>

        {/* The card to be captured */}
        <div className="flex justify-center py-2">
          <div
            ref={cardRef}
            style={{
              width: 400,
              background: "linear-gradient(135deg, hsl(215, 70%, 22%), hsl(215, 80%, 12%))",
              borderRadius: 16,
              overflow: "hidden",
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              direction: "rtl",
            }}
          >
            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 8px" }}>
              <img
                src={logo}
                alt="شعار"
                crossOrigin="anonymous"
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "contain", background: "white", border: "2px solid hsl(40, 85%, 55%)" }}
              />
              <span style={{ color: "hsl(40, 85%, 55%)", fontSize: 13, fontWeight: 700 }}>
                قائمة عهد الشباب
              </span>
            </div>

            {/* Profile */}
            <div style={{ textAlign: "center", padding: "12px 20px 16px" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%", margin: "0 auto 12px",
                border: "3px solid hsl(40, 85%, 55%)", overflow: "hidden",
                background: "hsl(215, 50%, 35%)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {candidate.image_url ? (
                  <img src={candidate.image_url} crossOrigin="anonymous" alt={candidate.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={48} color="white" />
                )}
              </div>
              <h3 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>{candidate.name}</h3>
              <p style={{ color: "hsl(40, 85%, 55%)", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>{candidate.specialty}</p>
            </div>

            {/* Info */}
            <div style={{ padding: "0 20px 12px", display: "flex", justifyContent: "center", gap: 16 }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                📍 {candidate.location}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                🎓 {candidate.education}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                {candidate.age} سنة
              </span>
            </div>

            {/* Quote */}
            {candidate.quote && (
              <div style={{
                margin: "0 20px 16px", padding: "12px 16px",
                background: "rgba(255,255,255,0.08)", borderRadius: 12,
                borderRight: "3px solid hsl(40, 85%, 55%)",
              }}>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
                  "{candidate.quote}"
                </p>
              </div>
            )}

            {/* Footer */}
            <div style={{
              background: "hsl(40, 85%, 55%)", padding: "10px 20px",
              textAlign: "center",
            }}>
              <p style={{ color: "hsl(215, 70%, 22%)", fontSize: 12, fontWeight: 700, margin: 0 }}>
                انتخابات بلدية دورا 🇵🇸 • عهد الشباب
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={generateImage} disabled={generating} className="gap-2">
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            تحميل الصورة
          </Button>
          <Button variant="secondary" onClick={shareCard} disabled={generating} className="gap-2">
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            مشاركة مباشرة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
