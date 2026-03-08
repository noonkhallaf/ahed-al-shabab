import { motion } from "framer-motion";
import { Phone, Mail, Facebook, Instagram, MessageCircle, MapPin, Send as SendIcon } from "lucide-react";

const contactInfo = [
  { icon: Phone, label: "الهاتف", value: "+962 7X XXX XXXX", href: "tel:+9627XXXXXXXX" },
  { icon: MessageCircle, label: "واتساب", value: "+962 7X XXX XXXX", href: "https://wa.me/9627XXXXXXXX" },
  { icon: Mail, label: "البريد الإلكتروني", value: "info@ahdalshabab.com", href: "mailto:info@ahdalshabab.com" },
  { icon: Facebook, label: "فيسبوك", value: "قائمة عهد الشباب", href: "#" },
  { icon: Instagram, label: "انستغرام", value: "@ahdalshabab", href: "#" },
  { icon: SendIcon, label: "تيليجرام", value: "@ahdalshabab", href: "#" },
];

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-4xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">تواصل معنا</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4">نسعد بتواصلكم معنا عبر أي من القنوات التالية</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactInfo.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener"
              className="glass-card rounded-xl p-6 flex items-center gap-4 hover:shadow-xl hover:border-secondary/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <c.icon className="text-secondary" size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="font-medium text-foreground text-sm">{c.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Map placeholder */}
        <motion.div
          className="glass-card rounded-xl mt-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-64 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin size={40} className="mx-auto mb-2" />
              <p>موقع مقر الحملة الانتخابية</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
