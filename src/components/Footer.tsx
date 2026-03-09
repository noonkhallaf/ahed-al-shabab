import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const { data: settings } = useSiteSettings();

  const phone = settings?.contactPhone || "+970599000000";
  const email = settings?.contactEmail || "info@ahd-shabab.ps";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start gap-4">
            <img src={logo} alt="شعار عهد الشباب" className="h-20 w-auto" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              قائمة عهد الشباب – معًا نحو مستقبل أفضل. نسعى لتمثيل صوت الشباب وخدمة المجتمع.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-secondary">روابط سريعة</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "المرشحون", href: "/candidates" },
                { label: "البرنامج الانتخابي", href: "/program" },
                { label: "الأخبار", href: "/news" },
                { label: "الاقتراحات", href: "/suggestions" },
              ].map((link) => (
                <Link key={link.href} to={link.href} className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-secondary">تواصل معنا</h3>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2"><Phone size={16} /><span dir="ltr">{phone}</span></div>
              <div className="flex items-center gap-2"><Mail size={16} /><span>{email}</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50 space-y-2">
          <p>© {new Date().getFullYear()} قائمة عهد الشباب. جميع الحقوق محفوظة.</p>
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>تطوير: Noor Edeen Khallaf</span>
            <a
              href={`https://wa.me/972594606294?text=${encodeURIComponent("مرحباً، تواصلت معك من موقع قائمة عهد الشباب 🌐\nأرغب بالاستفسار عن خدمات تطوير المواقع.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 transition-colors"
            >
              واتساب 💬
            </a>
            <a
              href="https://www.facebook.com/share/1Arvcd99Ce/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 transition-colors"
            >
              Facebook →
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
