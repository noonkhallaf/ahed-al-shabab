import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer, RefreshCw, MessageSquare, Users, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  session_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

interface QuestionStats {
  question: string;
  count: number;
}

export default function AdminChatAnalytics() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Parse messages from JSON
      const parsed = (data || []).map((s) => ({
        ...s,
        messages: Array.isArray(s.messages) ? s.messages as Message[] : [],
      }));
      
      setSessions(parsed);
    } catch (e) {
      console.error("Failed to fetch chat sessions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Extract all user questions
  const allUserQuestions = sessions.flatMap((s) =>
    s.messages.filter((m) => m.role === "user").map((m) => m.content.trim())
  );

  // Count question frequency
  const questionCounts: Record<string, number> = {};
  allUserQuestions.forEach((q) => {
    const normalized = q.toLowerCase();
    questionCounts[normalized] = (questionCounts[normalized] || 0) + 1;
  });

  const topQuestions: QuestionStats[] = Object.entries(questionCounts)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Stats
  const totalSessions = sessions.length;
  const totalQuestions = allUserQuestions.length;
  const avgQuestionsPerSession = totalSessions > 0 ? (totalQuestions / totalSessions).toFixed(1) : "0";

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <title>تقرير محادثات المساعد الذكي - عهد الشباب</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; direction: rtl; }
          h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
          h2 { color: #2d3748; margin-top: 30px; }
          .stats { display: flex; gap: 30px; margin: 20px 0; flex-wrap: wrap; }
          .stat-card { background: #f7fafc; padding: 15px 25px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 28px; font-weight: bold; color: #2b6cb0; }
          .stat-label { color: #718096; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0; }
          th { background: #edf2f7; font-weight: 600; }
          tr:hover { background: #f7fafc; }
          .question-count { background: #bee3f8; color: #2b6cb0; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
          .footer { margin-top: 40px; text-align: center; color: #a0aec0; font-size: 12px; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <h1>📊 تقرير محادثات المساعد الذكي "عَهْد"</h1>
        <p>تاريخ التقرير: ${format(new Date(), "PPP", { locale: ar })}</p>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${totalSessions}</div>
            <div class="stat-label">إجمالي المحادثات</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalQuestions}</div>
            <div class="stat-label">إجمالي الأسئلة</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${avgQuestionsPerSession}</div>
            <div class="stat-label">متوسط الأسئلة لكل محادثة</div>
          </div>
        </div>

        <h2>🔥 الأسئلة الأكثر شيوعاً</h2>
        <table>
          <thead>
            <tr><th>#</th><th>السؤال</th><th>عدد المرات</th></tr>
          </thead>
          <tbody>
            ${topQuestions.map((q, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${q.question}</td>
                <td><span class="question-count">${q.count}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h2>📝 جميع المحادثات (${totalSessions})</h2>
        ${sessions.map((session) => {
          const userMsgs = session.messages.filter((m) => m.role === "user");
          if (userMsgs.length === 0) return "";
          return `
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <strong>المحادثة ${session.session_id.slice(0, 8)}...</strong>
              <span style="color: #a0aec0; font-size: 12px; margin-right: 10px;">
                ${format(new Date(session.created_at), "PPp", { locale: ar })}
              </span>
              <ul style="margin: 10px 0;">
                ${userMsgs.map((m) => `<li>${m.content}</li>`).join("")}
              </ul>
            </div>
          `;
        }).join("")}

        <div class="footer">
          <p>تقرير مُنشأ تلقائياً من نظام إدارة حملة عهد الشباب</p>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">محادثات المساعد الذكي</h2>
          <p className="text-muted-foreground">تحليل الأسئلة الشائعة والمحادثات مع الزوار</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSessions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 ml-2" />
            طباعة التقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? "..." : totalSessions}</p>
              <p className="text-muted-foreground text-sm">إجمالي المحادثات</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? "..." : totalQuestions}</p>
              <p className="text-muted-foreground text-sm">إجمالي الأسئلة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? "..." : avgQuestionsPerSession}</p>
              <p className="text-muted-foreground text-sm">متوسط الأسئلة/محادثة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            الأسئلة الأكثر شيوعاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : topQuestions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">لا توجد أسئلة بعد</p>
          ) : (
            <div className="space-y-2">
              {topQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm">{q.question}</span>
                  </div>
                  <Badge variant="secondary">{q.count} مرة</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            جميع المحادثات ({totalSessions})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">لا توجد محادثات بعد</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const userMsgs = session.messages.filter((m) => m.role === "user");
                if (userMsgs.length === 0) return null;
                
                const isExpanded = expandedSession === session.id;
                
                return (
                  <div
                    key={session.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {userMsgs.length} سؤال
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(session.created_at), "PPp", { locale: ar })}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t p-4 bg-muted/30 space-y-3">
                        {session.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground mr-8"
                                : "bg-background border ml-8"
                            }`}
                          >
                            <p className="text-xs opacity-70 mb-1">
                              {msg.role === "user" ? "الزائر" : "عَهْد"}
                            </p>
                            <p>{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
