import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="flex flex-col items-start gap-4">
            <img src={logo} alt="شعار عهد الشباب" className="h-20 w-auto" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              قائمة عهد الشباب – معًا نحو مستقبل أفضل. نسعى لتمثيل صوت الشباب وخدمة المجتمع.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-secondary">روابط سريعة</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "المرشحون", href: "/candidates" },
                { label: "البرنامج الانتخابي", href: "/program" },
                { label: "الأخبار", href: "/news" },
                { label: "تواصل معنا", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-secondary">تواصل معنا</h3>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span dir="ltr">+962 7X XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@ahdalshabab.com</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Facebook, label: "فيسبوك" },
                { icon: Instagram, label: "انستغرام" },
                { icon: MessageCircle, label: "واتساب" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} قائمة عهد الشباب. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
