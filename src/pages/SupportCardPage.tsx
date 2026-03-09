import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import { Upload, Download, Share2, Loader2, User, Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export default function SupportCardPage() {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب أن لا يتجاوز 5 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
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
      link.download = `بطاقة-دعم-${name || "عهد-الشباب"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
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
        if (!blob) { setGenerating(false); return; }
        const file = new File([blob], `بطاقة-دعم.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: "أنا أدعم قائمة عهد الشباب 🇵🇸",
            text: `${name ? name + " يدعم" : "أنا أدعم"} قائمة عهد الشباب – انتخابات بلدية دورا`,
            files: [file],
          });
        } else {
          const link = document.createElement("a");
          link.download = `بطاقة-دعم-${name || "عهد-الشباب"}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        setGenerating(false);
      });
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  const reset = () => {
    setName("");
    setPhotoUrl(null);
  };

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-2xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            أنشئ بطاقة دعمك 🇵🇸
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            ادعم قائمة عهد الشباب بإنشاء بطاقة دعم شخصية وشاركها على مواقع التواصل
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-8 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-2">
            <Label className="font-heading font-bold">اسمك الكامل</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك هنا..."
              className="text-center text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-heading font-bold">صورتك الشخصية</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            {photoUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={photoUrl}
                  alt="صورتك"
                  className="w-28 h-28 rounded-full object-cover border-4 border-secondary shadow-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="gap-2"
                >
                  <Camera size={14} />
                  تغيير الصورة
                </Button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-secondary hover:bg-muted/50 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
                <span className="text-muted-foreground text-sm">
                  اضغط هنا لرفع صورتك (اختياري)
                </span>
              </button>
            )}
          </div>

          {(name || photoUrl) && (
            <Button variant="ghost" size="sm" onClick={reset} className="gap-2 text-muted-foreground">
              <RotateCcw size={14} />
              إعادة تعيين
            </Button>
          )}
        </motion.div>

        {/* Card Preview */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-heading font-bold text-foreground mb-4 text-center">معاينة البطاقة</h3>
          <div className="flex justify-center">
            <div
              ref={cardRef}
              style={{
                width: 420,
                background: "linear-gradient(145deg, hsl(215, 70%, 22%) 0%, hsl(215, 80%, 14%) 60%, hsl(215, 85%, 10%) 100%)",
                borderRadius: 20,
                overflow: "hidden",
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                direction: "rtl",
                position: "relative",
              }}
            >
              {/* Decorative circles */}
              <div style={{
                position: "absolute", top: -30, left: -30, width: 120, height: 120,
                borderRadius: "50%", background: "rgba(255,255,255,0.03)",
              }} />
              <div style={{
                position: "absolute", bottom: 50, right: -40, width: 160, height: 160,
                borderRadius: "50%", background: "rgba(255,255,255,0.02)",
              }} />

              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px 8px", position: "relative", zIndex: 1,
              }}>
                <img
                  src={logo}
                  alt="شعار"
                  crossOrigin="anonymous"
                  style={{
                    width: 50, height: 50, borderRadius: "50%", objectFit: "contain",
                    background: "white", border: "2px solid hsl(40, 85%, 55%)",
                  }}
                />
                <div style={{ textAlign: "left" }}>
                  <span style={{ color: "hsl(40, 85%, 55%)", fontSize: 14, fontWeight: 700, display: "block" }}>
                    عهد الشباب
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
                    انتخابات بلدية دورا
                  </span>
                </div>
              </div>

              {/* "أنا أدعم" text */}
              <div style={{ textAlign: "center", padding: "16px 24px 8px", position: "relative", zIndex: 1 }}>
                <span style={{
                  color: "hsl(40, 85%, 55%)", fontSize: 15, fontWeight: 700,
                  letterSpacing: 2,
                }}>
                  ✦ أنا أدعم ✦
                </span>
              </div>

              {/* Photo */}
              <div style={{ textAlign: "center", padding: "8px 24px 12px", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
                  border: "4px solid hsl(40, 85%, 55%)",
                  boxShadow: "0 0 30px rgba(218, 165, 32, 0.3)",
                  overflow: "hidden",
                  background: "hsl(215, 50%, 30%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <User size={56} color="rgba(255,255,255,0.4)" />
                  )}
                </div>
              </div>

              {/* Name */}
              <div style={{ textAlign: "center", padding: "4px 24px 8px", position: "relative", zIndex: 1 }}>
                <h2 style={{
                  color: "white", fontSize: 26, fontWeight: 700, margin: 0,
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}>
                  {name || "اسمك هنا"}
                </h2>
              </div>

              {/* Quote */}
              <div style={{
                margin: "8px 24px 20px", padding: "14px 18px",
                background: "rgba(255,255,255,0.07)", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center", position: "relative", zIndex: 1,
              }}>
                <p style={{
                  color: "rgba(255,255,255,0.85)", fontSize: 14, margin: 0, lineHeight: 1.8,
                }}>
                  أدعم قائمة <strong style={{ color: "hsl(40, 85%, 55%)" }}>عهد الشباب</strong> لأنها تمثّل
                  <br />
                  طموح الشباب في بناء مستقبل أفضل لمدينة دورا 🇵🇸
                </p>
              </div>

              {/* Footer */}
              <div style={{
                background: "linear-gradient(90deg, hsl(40, 85%, 50%), hsl(40, 90%, 58%))",
                padding: "12px 24px",
                textAlign: "center",
                position: "relative", zIndex: 1,
              }}>
                <p style={{
                  color: "hsl(215, 70%, 18%)", fontSize: 13, fontWeight: 800, margin: 0,
                }}>
                  🗳️ صوتك أمانة • عهد الشباب • دورا
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={handleDownload} disabled={generating} size="lg" className="gap-2 font-heading font-bold">
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            تحميل البطاقة
          </Button>
          <Button variant="secondary" onClick={handleShare} disabled={generating} size="lg" className="gap-2 font-heading font-bold">
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
            مشاركة مباشرة
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
