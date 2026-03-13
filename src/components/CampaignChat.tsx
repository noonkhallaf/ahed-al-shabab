import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campaign-chat`;

const SUGGESTIONS = [
  "من هم مرشحو القائمة؟",
  "ما هو برنامج عهد الشباب؟",
  "كيف أشارك باقتراحاتي؟",
  "لماذا أصوّت لعهد الشباب؟",
];

// Generate unique session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
};

export default function CampaignChat() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "أهلاً وسهلاً! 👋 أنا **عَهْد**، مساعدك الذكي لقائمة **عَهْد الشباب** في دورا.\n\nيسعدني الإجابة على أي سؤال عن مرشحينا الـ14، برنامجنا الانتخابي، أو رؤيتنا لمستقبل مدينتنا.\n\n💡 **صوتك مهم!** شاركنا اقتراحاتك لتطوير دورا.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef(getSessionId());

  // Save messages to database
  const saveMessages = useCallback(async (msgs: Message[]) => {
    // Only save if there are user messages
    if (msgs.filter(m => m.role === "user").length === 0) return;
    
    try {
      const { data: existing } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("session_id", sessionIdRef.current)
        .single();

      if (existing) {
        await supabase
          .from("chat_sessions")
          .update({ messages: JSON.parse(JSON.stringify(msgs)) })
          .eq("session_id", sessionIdRef.current);
      } else {
        await supabase
          .from("chat_sessions")
          .insert({ session_id: sessionIdRef.current, messages: JSON.parse(JSON.stringify(msgs)) });
      }
    } catch (e) {
      console.error("Failed to save chat session:", e);
    }
  }, []);

  // Auto-open chat after 8 seconds on first visit to encourage usage
  useEffect(() => {
    const hasSeenAutoOpen = sessionStorage.getItem("chat_auto_opened");
    if (!hasSeenAutoOpen) {
      const autoOpenTimer = setTimeout(() => {
        if (!open) {
          setOpen(true);
          sessionStorage.setItem("chat_auto_opened", "true");
        }
      }, 8000);
      return () => clearTimeout(autoOpenTimer);
    }
  }, []);

  // Show attention bubble after 3 seconds, then hide after 3 more seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (!open) setShowBubble(true);
    }, 3000);
    return () => clearTimeout(showTimer);
  }, [open]);

  // Auto-hide bubble after 3 seconds of showing
  useEffect(() => {
    if (showBubble) {
      const hideTimer = setTimeout(() => {
        setShowBubble(false);
      }, 3000);
      return () => clearTimeout(hideTimer);
    }
  }, [showBubble]);

  // Hide bubble when chat opens
  useEffect(() => {
    if (open) setShowBubble(false);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantText = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "خطأ في الاتصال" }));
        if (resp.status === 429) toast({ title: err.error, variant: "destructive" });
        else if (resp.status === 402) toast({ title: err.error, variant: "destructive" });
        else toast({ title: "حدث خطأ. حاول مجدداً.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // Streaming
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunk) {
              assistantText += chunk;
              if (!started) {
                setMessages(prev => [...prev, { role: "assistant", content: assistantText }]);
                started = true;
              } else {
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantText };
                  return updated;
                });
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (!started) {
        const errorMsg: Message = { role: "assistant", content: "عذراً، لم أتمكن من الرد. حاول مجدداً." };
        setMessages(prev => {
          const updated = [...prev, errorMsg];
          saveMessages(updated);
          return updated;
        });
      } else {
        // Save messages after successful response
        setMessages(prev => {
          saveMessages(prev);
          return prev;
        });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "خطأ في الاتصال بالمساعد", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Check if message mentions suggestions
  const hasSuggestionLink = (text: string) => {
    return text.includes("اقتراح") || text.includes("شاركنا") || text.includes("صوتك مهم") || text.includes("اضغط هنا");
  };

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[اضغط هنا.*?\]/g, "") // Remove the text link since we'll show a button
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating button with attention grabber */}
      <div className="fixed bottom-6 left-6 z-50" style={{ display: open ? "none" : "block" }}>
        {/* Attention bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              className="absolute bottom-16 left-0 bg-primary text-primary-foreground rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-lg max-w-[200px]"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              dir="rtl"
            >
              <button
                onClick={() => setShowBubble(false)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-background text-foreground rounded-full text-xs flex items-center justify-center shadow-md"
              >
                ✕
              </button>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Sparkles size={14} className="flex-shrink-0" />
                <span>مرحباً! أنا عَهْد، هل عندك سؤال؟</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          aria-label="افتح المساعد الذكي"
        >
          <MessageCircle size={26} />
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50" />
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
            <Sparkles size={10} className="text-secondary-foreground" />
          </span>
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-4 left-4 z-50 w-[350px] sm:w-[400px] h-[560px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border bg-background"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-sm">عَهْد - المساعد الذكي</p>
                <p className="text-xs opacity-80">قائمة عَهْد الشباب • دورا</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="opacity-80 hover:opacity-100 transition-opacity"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" dir="rtl">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}>
                      {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                      dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                    />
                  </div>
                  {/* Show suggestions button after AI messages that mention it */}
                  {msg.role === "assistant" && hasSuggestionLink(msg.content) && (
                    <div className="mr-9 mt-2">
                      <Link
                        to="/suggestions"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Lightbulb size={12} />
                        شارك اقتراحك الآن
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (only when 1 message) */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 justify-end" dir="rtl">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs bg-muted hover:bg-accent text-foreground rounded-full px-3 py-1 transition-colors border border-border"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border bg-background" dir="rtl">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب سؤالك هنا..."
                  rows={1}
                  className="flex-1 resize-none bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary border border-border max-h-28 text-foreground placeholder:text-muted-foreground"
                  style={{ minHeight: "40px" }}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl flex-shrink-0"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={16} className="rotate-180" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                مساعد عَهْد الشباب • مدعوم بالذكاء الاصطناعي
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
