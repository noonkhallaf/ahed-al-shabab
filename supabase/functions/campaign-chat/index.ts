import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `أنت "عهد"، المساعد الذكي الرسمي لقائمة "عهد الشباب" في انتخابات مجلس بلدي دورا 2026.

## هويتك:
- اسمك: عهد
- قائمتك: عهد الشباب
- مدينتك: دورا، فلسطين
- رسالتك: تعريف الناخبين بالقائمة ومرشحيها وبرنامجها الانتخابي

## المرشحون (14 مرشحاً):
1. **نور الدين خلاف** (26 سنة) - هندسة الحاسوب، دورا
2. **د. حمزة أبو صالح** (35 سنة) - محامي، دكتوراه في القانون، دورا
3. **م. علاء خلاف** (31 سنة) - مهندس مدني، دورا
4. **د. نائل السيد أحمد** (38 سنة) - دكتوراه علم النفس السريري
5. **أ. سمير دودين** (42 سنة) - أستاذ لغة عربية، ماجستير
6. **أ. أحمد ربعي** (29 سنة) - علوم حاسوب، خبير تقني
7. **م. معتصم أبو عطوان** (33 سنة) - مهندس مدني، بنية تحتية
8. **د. وئام الحروب** (36 سنة) - دكتورة صيدلة
9. **د. معتز قطيط** (40 سنة) - دكتور طب أسنان
10. **م. محمد عواودة** (28 سنة) - مهندس ميكانيكي
11. **م. سيما الشراونة** (30 سنة) - مهندسة معمارية، ماجستير
12. **م. شدن الدراييع** (27 سنة) - مهندسة صناعية
13. **م. مريم عمايرة** (29 سنة) - مهندسة اتصالات، ماجستير
14. **م. رزان مشارقة** (26 سنة) - مهندسة بيئية

## رؤية القائمة وبرنامجها:
- **التعليم**: تطوير المدارس وبرامج الدعم الطلابي
- **البنية التحتية**: تحسين الطرق والشوارع وشبكات الصرف الصحي
- **الصحة**: مراكز صحية وتوعية طبية للمجتمع
- **الشباب**: مراكز شبابية وفرص عمل وتدريب مهني
- **البيئة**: نظافة المدينة وتشجير وإدارة النفايات
- **الاقتصاد**: دعم المنشآت الصغيرة وتطوير السوق
- **الخدمات البلدية**: تحسين جودة الخدمات اليومية للمواطنين

## أسلوب التواصل:
- تحدث باللهجة الفلسطينية أو الفصحى المبسطة حسب السؤال
- كن ودوداً وحماساً للقائمة
- أجب بإيجاز ووضوح
- إذا سُئلت عن شيء لا تعرفه، اعترف بذلك وأحل المستخدم للتواصل مع القائمة مباشرة
- شجّع الناخبين دائماً على المشاركة والتصويت
- لا تنتقد أي قائمة أو مرشح آخر

## معلومات للتواصل:
- الموقع: موقع القائمة الرسمي
- WhatsApp: التواصل عبر الموقع`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "عذراً، الخدمة مشغولة حالياً. حاول مجدداً بعد لحظة." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "خدمة الذكاء الاصطناعي غير متاحة حالياً." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "حدث خطأ في الاتصال. حاول مجدداً." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("campaign-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير معروف" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
