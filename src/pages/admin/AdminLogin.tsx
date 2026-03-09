import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const motivationalMessages = [
  { text: "مرحباً بعودتك!", sub: "معاً نصنع التغيير ونبني مستقبلاً أفضل لمدينتنا", emoji: "💪" },
  { text: "أهلاً بك قائدنا!", sub: "عملك يصنع الفرق الحقيقي في مجتمعنا", emoji: "🌟" },
  { text: "مرحباً بالبطل!", sub: "كل جهد تبذله يقرّبنا خطوة من النجاح", emoji: "🚀" },
  { text: "أهلاً وسهلاً!", sub: "طاقتك وإبداعك يلهمان الفريق بأكمله", emoji: "✨" },
  { text: "مرحباً بالقائد!", sub: "استمر فالنصر قريب والمستقبل مشرق", emoji: "🏆" },
  { text: "أهلاً بك!", sub: "حماسك والتزامك هما وقود نجاحنا المستمر", emoji: "🔥" },
  { text: "مرحباً!", sub: "أنت ركيزة أساسية في بناء هذا المشروع العظيم", emoji: "💎" },
  { text: "أهلاً بعودتك!", sub: "كل يوم جديد هو فرصة لزراعة بذرة نجاح", emoji: "🌱" },
];

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState(motivationalMessages[0]);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setWelcomeMsg(msg);
      setShowWelcome(true);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleContinue = () => {
    setShowWelcome(false);
    navigate('/admin');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-primary p-4" dir="rtl">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img src={logo} alt="شعار القائمة" className="w-16 h-16 object-contain" />
            </div>
            <CardTitle className="text-2xl font-heading">لوحة تحكم عهد الشباب</CardTitle>
            <p className="text-muted-foreground text-sm">تسجيل دخول المدير</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="pr-10"
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pr-10"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full">تسجيل الدخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Motivational Popup */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            dir="rtl"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-primary/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-secondary/40"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800) - 400,
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
                  scale: 0,
                }}
                animate={{
                  y: [null, -100, -200],
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Content */}
            <motion.div
              className="relative z-10 text-center max-w-lg mx-auto"
              initial={{ scale: 0.5, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 60 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
            >
              {/* Emoji */}
              <motion.div
                className="text-7xl mb-6"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, delay: 0.3 }}
              >
                {welcomeMsg.emoji}
              </motion.div>

              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
              >
                <img
                  src={logo}
                  alt="شعار عهد الشباب"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-secondary shadow-2xl object-contain bg-card mb-6"
                />
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {welcomeMsg.text}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl text-primary-foreground/80 mb-3 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {welcomeMsg.sub}
              </motion.p>

              {/* Sparkles decoration */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Sparkles className="text-secondary" size={20} />
                <span className="text-secondary font-heading font-bold text-lg">عهد الشباب</span>
                <Sparkles className="text-secondary" size={20} />
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="text-lg px-10 py-6 font-heading font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl gap-2"
                >
                  <ArrowLeft size={20} />
                  انطلق إلى لوحة التحكم
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
