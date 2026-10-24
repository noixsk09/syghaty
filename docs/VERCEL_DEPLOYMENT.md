# دليل النشر على Vercel — صيغتي

## المتطلبات المسبقة

قبل النشر، تأكد من:

1. **مشروع Supabase جاهز** مع تطبيق جميع المايجريشنز الأربع
2. **حساب Vercel** مرتبط بـ Git repo
3. **متغيرات البيئة** مُعدَّة في Vercel Dashboard

---

## 1. تطبيق قاعدة البيانات

جميع الجداول محددة في `supabase/migrations/` — تُطبَّق **مرة واحدة** على مشروع Supabase الإنتاجي:

```
1. 20261014000001_init_schema.sql       — الجداول الأساسية
2. 20261014000002_rls_policies.sql      — سياسات Row Level Security
3. 20261014000003_storage.sql           — Storage bucket للمستندات
4. 20261015000004_sayghty_schema.sql    — جداول صيغتي (مستندات، قوالب، اشتراكات)
```

**كيفية التطبيق:**
- افتح Supabase Dashboard → SQL Editor
- الصق محتوى كل ملف وشغِّله بالترتيب أعلاه

---

## 2. متغيرات البيئة على Vercel

اذهب إلى: **Project Settings → Environment Variables**

| المتغير | القيمة | الاتاحة |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Production + Preview + Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح anon من Supabase | Production + Preview + Development |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح service_role | **Production فقط** |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production + Preview |
| `AI_PROVIDER` | `openai` أو `demo` | Production + Preview |
| `OPENAI_API_KEY` | مفتاح OpenAI | **Production فقط** |
| `AI_MODEL` | `gpt-4o-mini` | Production + Preview |
| `NEXT_PUBLIC_APP_NAME` | `صيغتي \| Sayghty` | All |
| `NEXT_PUBLIC_APP_LOCALE` | `ar-EG` | All |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | `EGP` | All |
| `NEXT_PUBLIC_DEFAULT_TIMEZONE` | `Africa/Cairo` | All |

> ⚠️ **تحذير أمني**: لا تضع `SUPABASE_SERVICE_ROLE_KEY` و `OPENAI_API_KEY` في
> أي متغير `NEXT_PUBLIC_*` ولا تُضمِّنهما في كود الـ client-side.

---

## 3. إعدادات المشروع على Vercel

- **Framework Preset**: Next.js (يُكتشف تلقائيًا)
- **Build Command**: `next build` (الافتراضي — لا تضف `--turbopack`)
- **Output Directory**: `.next` (الافتراضي)
- **Install Command**: `npm install` (الافتراضي)
- **Node.js Version**: 20.x (موصى به)

---

## 4. Supabase Auth — إعداد Redirect URL

في Supabase Dashboard → Authentication → URL Configuration:

```
Site URL:         https://your-domain.vercel.app
Redirect URLs:    https://your-domain.vercel.app/**
                  https://*-your-team.vercel.app/**   (للـ Preview deployments)
```

---

## 5. ما تم إعداده تلقائيًا

التغييرات التالية جُهِّزت للنشر على Vercel:

### `next.config.ts`
- `serverExternalPackages: ["docx"]` — يمنع webpack من تحزيم مكتبة docx (تعمل على Node.js serverless فقط)
- Security headers على جميع المسارات (X-Frame-Options، X-Content-Type-Options، إلخ)

### `vercel.json`
- مهلة 30 ثانية لمسارات `/api/ai` و `/api/export` (لمعالجة الطلبات الكبيرة)

### `src/lib/supabase/middleware.ts`
- صفحتا `/terms` و `/privacy` مضافتان كـ public routes

### `src/app/layout.tsx`
- `metadataBase` تستخدم `NEXT_PUBLIC_APP_URL` (مطلوب لـ OpenGraph و canonical URLs)
- `viewport` export منفصل (Next.js 15 best practice)
- `title.template` لعناوين ديناميكية

---

## 6. القيود والمخاطر المعروفة

### Rate Limiting في `/api/ai`
المحدِّد الحالي يعمل في الذاكرة — على Vercel Serverless كل cold start يُصفِّر العداد.
**للإنتاج الجاد**: استخدم [Upstash Redis](https://upstash.com) مع Vercel KV:

```bash
npm install @upstash/ratelimit @upstash/redis
```

ثم أضف في Vercel:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### PDF Export
التصدير PDF يعيد HTML + زر `window.print()` — لا يُنشئ ملف PDF مباشرة.
للتصدير الحقيقي، يمكن استخدام مكتبة مثل `@sparticuz/chromium` لاحقًا.

### Supabase Service Role Key
لم يُستخدم بعد في الكود الحالي. متاح عبر `getServiceRoleKey()` في `src/lib/supabase/env.ts`
للاستخدام المستقبلي (notifications، admin operations).

---

## 7. اختبار ما بعد النشر

بعد النشر، تحقق من:

- [ ] الصفحة الرئيسية (`/`) تُحمَّل صحيحًا
- [ ] تسجيل الدخول والتسجيل يعملان
- [ ] إنشاء مكتب جديد (onboarding) يعمل
- [ ] لوحة التحكم تُعرض بيانات صحيحة
- [ ] إنشاء مستند جديد يعمل
- [ ] تصدير TXT وDOCX يعملان
- [ ] وضع AI demo يعمل (إذا `AI_PROVIDER=demo`)
