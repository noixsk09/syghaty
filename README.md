# صيغتي | Sayghty

مساعد قانوني ذكي للمحامين في مصر لإنشاء مسودات المذكرات والعقود والمستندات القضائية.

---

## ⚠️ تنبيه قانوني

المستندات التي تُنشئها صيغتي هي **مسودات أولية للمساعدة فقط**. لا تُعدّ هذه المسودات مشورة قانونية ولا يُعتمد عليها للتوقيع أو الإيداع الرسمي دون مراجعة محامٍ مرخَّص.

---

## التقنيات المستخدمة

| البند | التفصيل |
|---|---|
| الإطار | Next.js 15 مع App Router و TypeScript |
| التنسيق | Tailwind CSS v4 |
| قاعدة البيانات | Supabase (PostgreSQL) |
| المصادقة | Supabase Auth |
| الذكاء الاصطناعي | OpenAI API (اختياري — وضع تجريبي بدونه) |
| التصدير | DOCX (مكتبة docx) + PDF (print) + TXT |
| الخط | Cairo من Google Fonts |
| الاتجاه | RTL كامل |

---

## المتطلبات الأساسية

- Node.js 18+
- مشروع Supabase (مجاني)
- مفتاح OpenAI (اختياري)

---

## التثبيت والتشغيل

### 1. استنسخ المشروع وثبّت الاعتماديات

```powershell
cd mo7ami-pro
npm install
```

### 2. أعدّ متغيرات البيئة

```powershell
Copy-Item .env.example .env.local
```

ثم افتح `.env.local` وأضف قيمك:

```env
# Supabase — مطلوب
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# الذكاء الاصطناعي — اختياري (وضع تجريبي بدونه)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

### 3. أعدّ قاعدة البيانات في Supabase

من لوحة تحكم Supabase → SQL Editor، طبّق الملفات بالترتيب:

```
supabase/migrations/20261014000001_init_schema.sql
supabase/migrations/20261014000002_rls_policies.sql
supabase/migrations/20261014000003_storage.sql
supabase/migrations/20261015000004_sayghty_schema.sql
```

### 4. شغّل التطبيق

```powershell
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000)

---

## هيكل المشروع

```
src/
├── app/
│   ├── (app)/              # الصفحات المحمية (تتطلب تسجيل دخول)
│   │   ├── dashboard/      # لوحة التحكم
│   │   ├── templates/      # مكتبة القوالب القانونية
│   │   ├── documents/      # المستندات المحفوظة
│   │   │   ├── new/        # إنشاء مستند جديد (wizard)
│   │   │   ├── [id]/edit/  # محرر المستندات
│   │   │   └── favorites/  # المستندات المفضلة
│   │   ├── profile/        # الملف الشخصي
│   │   ├── pricing/        # خطط الاشتراك
│   │   └── settings/       # إعدادات التطبيق
│   ├── (auth)/             # صفحات المصادقة
│   │   ├── login/
│   │   └── signup/
│   ├── api/
│   │   ├── ai/             # Route Handler لخدمة AI
│   │   └── export/         # Route Handler للتصدير
│   ├── privacy/            # سياسة الخصوصية
│   ├── terms/              # شروط الاستخدام
│   └── page.tsx            # صفحة الهبوط التسويقية
├── components/
│   ├── documents/          # مكونات المستندات
│   ├── layout/             # AppShell, Sidebar, Topbar
│   ├── profile/            # مكونات الملف الشخصي
│   ├── settings/           # مكونات الإعدادات
│   └── ui/                 # مكونات UI القابلة لإعادة الاستخدام
├── lib/
│   ├── ai-service.ts       # طبقة AI (OpenAI + وضع تجريبي)
│   ├── docx-builder.ts     # بناء ملفات DOCX
│   ├── firm.ts             # إدارة جلسة المكتب
│   ├── permissions.ts      # نظام الصلاحيات
│   ├── templates-data.ts   # القوالب القانونية التجريبية
│   └── supabase/           # إعداد عملاء Supabase
└── types/
    └── database.ts         # أنواع TypeScript لقاعدة البيانات
```

---

## الصفحات المتاحة

| الصفحة | الوصف |
|---|---|
| `/` | صفحة الهبوط التسويقية |
| `/login` | تسجيل الدخول |
| `/signup` | إنشاء حساب |
| `/dashboard` | لوحة تحكم المحامي |
| `/templates` | مكتبة القوالب القانونية |
| `/documents` | المستندات المحفوظة |
| `/documents/new` | معالج إنشاء مستند جديد |
| `/documents/[id]/edit` | محرر المستندات |
| `/documents/favorites` | المستندات المفضلة |
| `/profile` | الملف الشخصي والإعدادات |
| `/pricing` | خطط الاشتراك |
| `/settings` | إعدادات التطبيق |
| `/privacy` | سياسة الخصوصية |
| `/terms` | شروط الاستخدام |

---

## القوالب القانونية المتاحة

- عقد بيع عقار
- عقد إيجار سكني
- عقد عمل محدد المدة
- إنذار قانوني بالسداد
- توكيل رسمي عام
- صحيفة دعوى مدنية
- مذكرة دفاع قانونية
- اتفاقية تجارية عامة

---

## إعداد Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com)
2. من لوحة التحكم → Settings → API، انسخ:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. طبّق ملفات الـ migrations بالترتيب من SQL Editor
4. تحقق من تفعيل Email Auth من Authentication → Providers

---

## إعداد الذكاء الاصطناعي

**بدون مفتاح API:** يعمل التطبيق في وضع تجريبي يُظهر نصوصاً توضيحية.

**مع OpenAI:**
1. أنشئ مفتاح API من [platform.openai.com](https://platform.openai.com)
2. أضفه في `.env.local`:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   AI_MODEL=gpt-4o-mini
   ```
3. أعِد تشغيل التطبيق

**ملاحظة أمنية:** مفتاح API يُخزَّن في `.env.local` فقط ولا يظهر في كود الواجهة أبدًا.

---

## الأمان والخصوصية

- **Row Level Security:** كل مستخدم يرى مستنداته فقط — مطبَّق على مستوى قاعدة البيانات
- **مصادقة:** Supabase Auth مع تجديد جلسة تلقائي
- **API Routes:** جميع استدعاءات AI تمر عبر الخادم — المفتاح لا يُكشف للمتصفح
- **تحديد معدل الطلبات:** 20 طلب/دقيقة لكل مستخدم على endpoints الـ AI

---

## الترخيص

هذا المشروع لأغراض تعليمية وتجريبية. راجع ملف LICENSE للتفاصيل.

---

*صيغتي | Sayghty — مُنشأ بـ Next.js وSupabase وTypeScript*
