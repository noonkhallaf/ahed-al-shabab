import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const STORAGE_KEY = "ahd_welcome_seen";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header with gradient */}
            <div className="gradient-hero p-8 text-center relative">
              <button
                onClick={dismiss}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={16} className="text-primary-foreground" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <img src={logo} alt="شعار عهد الشباب" className="w-20 h-20 mx-auto rounded-full border-3 border-secondary shadow-lg object-contain bg-white" />
              </motion.div>

              <motion.h2
                className="font-heading font-bold text-2xl text-primary-foreground mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                أهلاً بك في موقع عهد الشباب
              </motion.h2>

              <motion.p
                className="text-primary-foreground/80 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                قائمة شبابية طموحة لخدمة مدينة دورا 🇵🇸
              </motion.p>
            </div>

            {/* Body */}
            <div className="bg-card p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <motion.div
                  className="p-3 rounded-xl bg-muted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Users size={22} className="mx-auto text-secondary mb-1" />
                  <p className="text-xs font-medium text-foreground">مرشحونا</p>
                </motion.div>
                <motion.div
                  className="p-3 rounded-xl bg-muted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Star size={22} className="mx-auto text-secondary mb-1" />
                  <p className="text-xs font-medium text-foreground">برنامجنا</p>
                </motion.div>
                <motion.div
                  className="p-3 rounded-xl bg-muted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <MapPin size={22} className="mx-auto text-secondary mb-1" />
                  <p className="text-xs font-medium text-foreground">مدينة دورا</p>
                </motion.div>
              </div>

              <motion.p
                className="text-muted-foreground text-sm text-center leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                تعرّف على مرشحينا وبرنامجنا الانتخابي، وشاركنا رأيك واقتراحاتك لبناء مستقبل أفضل لمدينتنا.
              </motion.p>

              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button asChild className="flex-1 font-heading font-bold" onClick={dismiss}>
                  <Link to="/candidates">تعرّف على المرشحين</Link>
                </Button>
                <Button variant="outline" className="flex-1 font-heading" onClick={dismiss}>
                  استكشف الموقع
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
