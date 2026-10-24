import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)]" dir="rtl">
      <nav className="border-b border-[var(--border)] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--navy)]">
              <Scale className="h-4 w-4 text-[var(--gold)]" />
            </div>
            <span className="font-bold text-[var(--navy)]">صيغتي</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--navy)]"
          >
            <ArrowRight className="h-4 w-4" />
            الرئيسية
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-[var(--navy)]">شروط الاستخدام</h1>
        <p className="mb-8 text-sm text-[var(--muted)]">
          آخر تحديث: أكتوبر 2026 — باستخدامك لصيغتي فأنت توافق على هذه الشروط.
        </p>

        <div className="space-y-6 text-[var(--navy)]">
          <section>
            <h2 className="text-lg font-bold">1. طبيعة الخدمة</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              صيغتي أداة مساعدة لصياغة مسودات المستندات القانونية. لا تُقدِّم الخدمة
              مشورة قانونية ولا تحل محل المحامي. جميع المستندات الناتجة هي مسودات أولية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">2. حدود المسؤولية القانونية</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              يلتزم المستخدم بمراجعة أي مستند قبل توقيعه أو إيداعه أمام أي جهة رسمية.
              صيغتي وفريقها غير مسؤولين عن أي أضرار تنتج عن استخدام المستندات المُنشأة
              دون مراجعة قانونية متخصصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">3. الاستخدام المقبول</h2>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[var(--muted)]">
              <li>الخدمة مخصصة للمحامين والمستشارين القانونيين في مصر.</li>
              <li>يُحظر استخدام الخدمة لأغراض احتيالية أو غير مشروعة.</li>
              <li>يُحظر مشاركة حسابك مع مستخدمين آخرين دون اشتراك مكتب.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">4. ملكية المحتوى</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              المستندات التي تُنشئها ملك لك. صيغتي لا تدّعي أي حقوق على محتوى
              مستنداتك. بالمقابل، أنت تمنحنا إذنًا لمعالجة المحتوى لتقديم الخدمة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">5. الاشتراكات والدفع</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              الخطة المجانية متاحة بحدود محددة. الخطط المدفوعة ستُفعَّل عند إطلاق بوابة
              الدفع. لا تُسترد الرسوم إلا في حالات عطل جوهري في الخدمة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">6. التعديلات على الشروط</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              نحتفظ بحق تعديل هذه الشروط. سيُخطَر المستخدمون بأي تغييرات جوهرية عبر
              البريد الإلكتروني المسجَّل أو بإشعار داخل التطبيق.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">7. القانون الحاكم</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              تخضع هذه الشروط لقوانين جمهورية مصر العربية. تختص محاكم القاهرة بالنظر
              في أي نزاعات تتعلق بهذه الشروط.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
