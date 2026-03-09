

# خطة التطوير: فيديو Hero + عداد حقيقي + مشاركة اجتماعية + إصلاح المعرض

---

## 1. فيديو خلفية في Hero Section

**الوضع الحالي:** Hero Section يعرض خلفية gradient بسيطة مع شعار ونصوص.

**التعديل:** إضافة فيديو خلفية قصير يعمل تلقائياً (autoplay, muted, loop) خلف المحتوى. سيتم استخدام إعداد `campaignVideo` الموجود في `site_settings` لتحديد رابط الفيديو من لوحة التحكم. إذا لم يكن هناك فيديو، يبقى التدرج اللوني كما هو.

**الملف:** `src/components/HeroSection.tsx`
- إضافة عنصر `<video>` بشكل absolute خلف المحتوى مع overlay داكن شفاف
- قراءة `settings?.campaignVideo` لتحديد رابط الفيديو
- fallback للتدرج الحالي عند عدم وجود فيديو

---

## 2. عداد زوار حقيقي (من قاعدة البيانات)

**الوضع الحالي:** قسم `SocialProofSection` يعرض أرقاماً ثابتة (boost values) من `site_settings`.

**التعديل:** جلب العدد الفعلي من جدول `page_views` وإضافته للـ boost، مع تأثير عداد متحرك (count-up animation).

**الملف:** `src/components/SocialProofSection.tsx`
- استعلام `page_views` بـ `count: 'exact', head: true` للحصول على العدد الحقيقي
- العرض = `visitorBoost + realPageViews`
- إضافة تأثير عداد تصاعدي باستخدام `useEffect` + `requestAnimationFrame`

---

## 3. زر مشاركة ذكي على مواقع التواصل

**التعديل:** إنشاء مكوّن `ShareFloatingButton` يظهر كزر عائم أنيق (أو شريط صغير) يشجع على المشاركة عبر واتساب، فيسبوك، تويتر، وتلجرام مع رسالة جاهزة تروّج للحملة.

**ملف جديد:** `src/components/ShareButton.tsx`
- زر عائم بأيقونة "مشاركة" مع قائمة منبثقة تعرض أيقونات التواصل
- كل رابط يفتح نافذة مشاركة بالمنصة المعنية مع نص تسويقي جاهز ورابط الموقع
- تأثير حركي لجذب الانتباه (pulse أو bounce خفيف)

**الملف:** `src/App.tsx` - إضافة المكوّن بجانب `CampaignChat` في الصفحات العامة

---

## 4. إصلاح معرض الصور في الصفحة الرئيسية

**المشكلة:** كاروسيل المعرض لا يعرض الصور (شاشة بيضاء). نفس مشكلة المرشحين سابقاً - الـ Carousel لا يدعم RTL بشكل افتراضي.

**الملف:** `src/components/GalleryPreview.tsx`
- إضافة `direction: "rtl"` لخيارات الكاروسيل (كما تم حل مشكلة المرشحين سابقاً)

---

## ملخص الملفات المتأثرة

| الملف | التعديل |
|---|---|
| `src/components/HeroSection.tsx` | إضافة فيديو خلفية |
| `src/components/SocialProofSection.tsx` | عداد حقيقي + تأثير count-up |
| `src/components/ShareButton.tsx` | مكوّن جديد لمشاركة التواصل |
| `src/components/GalleryPreview.tsx` | إصلاح RTL للكاروسيل |
| `src/App.tsx` | إضافة ShareButton |

