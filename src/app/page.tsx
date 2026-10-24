import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Scale,
  FileText,
  Zap,
  Shield,
  Download,
  CheckCircle,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

export default async function LandingPage() {
  const env = getSupabaseEnv();
  if (!env.isConfigured) redirect("/setup-required");

  // إذا المستخدم مسجل دخوله → اذهب للوحة التحكم
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  } catch {
    // Supabase غير متاح — اعرض الصفحة
  }

  const features = [
    {
      icon: FileText,
      title: "مكتبة قوالب قانونية شاملة",
      desc: "أكثر من 8 تصنيفات تشمل العقود والمذكرات وصحف الدعاوى والإنذارات والتوكيلات.",
    },
    {
      icon: Zap,
      title: "إنشاء بالذكاء الاصطناعي",
      desc: "صيِّغ مسوداتك بلحظات بناءً على الوقائع التي تُدخلها مع الحفاظ على الأسلوب القانوني.",
    },
    {
      icon: Shield,
      title: "أمان وخصوصية تامة",
      desc: "مستنداتك محمية بنظام Row Level Security — لا يراها سوى صاحبها.",
    },
    {
      icon: Download,
      title: "تصدير بصيغ متعددة",
      desc: "صدِّر مستنداتك بصيغ DOCX وPDF وTXT مع دعم كامل للعربية واتجاه RTL.",
    },
    {
      icon: BookOpen,
      title: "محرر نصي متكامل",
      desc: "حرِّر المسودة كاملاً، أضف عليها وعدِّلها، مع حفظ تلقائي وسجل إصدارات.",
    },
    {
      icon: CheckCircle,
      title: "تنبيهات قانونية واضحة",
      desc: "كل مسودة تُصاحَب بتنبيه واضح بضرورة المراجعة — لا تُقدَّم باعتبارها مضمونة.",
    },
  ];

  const steps = [
    { n: "١", title: "اختر القالب", desc: "من مكتبة القوالب القانونية المصنَّفة" },
    { n: "٢", title: "أدخل البيانات", desc: "أسماء الأطراف، الوقائع، التواريخ والمبالغ" },
    { n: "٣", title: "ولِّد المسودة", desc: "مباشرةً أو بمساعدة الذكاء الاصطناعي" },
    { n: "٤", title: "راجع وصدِّر", desc: "عدِّل النص ثم صدِّره DOCX أو PDF" },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--navy)]">
              <Scale className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div>
              <span className="font-bold text-[var(--navy)]">صيغتي</span>
              <span className="mx-1 text-[var(--muted)]">|</span>
              <span className="text-sm text-[var(--muted)]">Sayghty</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--surface)]"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-600)] transition-colors"
            >
              ابدأ مجانًا
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--navy)] to-[var(--navy-600)] px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            المساعد القانوني للمحامين المصريين
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            صيِّغ مستنداتك القانونية
            <br />
            <span className="text-[var(--gold)]">بدقة واحترافية</span>
          </h1>
          <p className="mb-8 text-lg text-white/80 md:text-xl">
            منصة ذكية تُساعد المحامين في مصر على إنشاء مسودات المذكرات والعقود والدعاوى
            — بأسلوب قانوني سليم، في وقت قياسي.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-[var(--gold)] px-8 py-3 text-base font-bold text-[var(--navy)] hover:opacity-90 transition-opacity"
            >
              ابدأ مجانًا الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/30 px-8 py-3 text-base font-medium hover:bg-white/10 transition-colors"
            >
              سجِّل الدخول
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/50">
            5 مستندات مجانية كل شهر — لا حاجة لبطاقة ائتمان
          </p>
        </div>
      </section>

      {/* خطوات الاستخدام */}
      <section className="bg-[var(--gold-soft)] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-[var(--navy)]">
            كيف تعمل صيغتي؟
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--navy)] text-xl font-bold text-[var(--gold)]">
                  {s.n}
                </div>
                <h3 className="mb-2 font-bold text-[var(--navy)]">{s.title}</h3>
                <p className="text-sm text-[var(--muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المزايا */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-[var(--navy)]">
            لماذا صيغتي؟
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-[var(--border)] bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--gold-soft)]">
                  <Icon className="h-5 w-5 text-[var(--navy)]" />
                </div>
                <h3 className="mb-2 font-bold text-[var(--navy)]">{title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تنبيه قانوني */}
      <section className="bg-[var(--surface)] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-[var(--gold)] bg-[var(--gold-soft)] p-6 text-center">
          <p className="text-sm font-semibold text-[var(--navy)]">⚠️ تنبيه قانوني مهم</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            المستندات التي تُنشئها صيغتي هي مسودات أولية للمساعدة فقط. لا تُعدّ هذه
            المسودات مشورة قانونية ولا يُعتمد عليها للإيداع أو التوقيع دون مراجعة محامٍ
            متخصص مرخَّص.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--navy)] px-4 py-16 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">هل أنت جاهز للبدء؟</h2>
        <p className="mb-8 text-white/70">
          انضم إلى المحامين الذين يستخدمون صيغتي لتوفير الوقت وتحسين جودة مستنداتهم.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold)] px-10 py-3 text-base font-bold text-[var(--navy)] hover:opacity-90 transition-opacity"
        >
          ابدأ مجانًا الآن
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <span>© 2026 صيغتي | Sayghty — جميع الحقوق محفوظة</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[var(--navy)] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-[var(--navy)] transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
