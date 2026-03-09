import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المرشحون", href: "/candidates" },
  { label: "البرنامج الانتخابي", href: "/program" },
  { label: "الأخبار", href: "/news" },
  { label: "المعرض", href: "/gallery" },
  { label: "استطلاع الرأي", href: "/poll" },
  { label: "اقتراحات", href: "/suggestions" },
  { label: "بطاقة دعم", href: "/support-card" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-primary/95 backdrop-blur-md shadow-lg">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="شعار قائمة عهد الشباب" className="h-10 md:h-14 w-auto bg-primary-foreground/90 rounded-lg p-1" />
          <span className="text-primary-foreground font-heading font-bold text-lg md:text-xl hidden sm:block">
            عهد الشباب
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-primary-foreground p-2"
          aria-label="فتح القائمة"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
