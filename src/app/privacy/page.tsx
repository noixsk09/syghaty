import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="mb-2 text-2xl font-bold text-[var(--navy)]">سياسة الخصوصية</h1>
        <p className="mb-8 text-sm text-[var(--muted)]">
          آخر تحديث: أكتوبر 2026 — يُرجى مراجعة هذه السياسة قبل الاستخدام.
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-[var(--navy)]">
          <section>
            <h2 className="text-lg font-bold">1. ما البيانات التي نجمعها؟</h2>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[var(--muted)]">
              <li>البريد الإلكتروني والاسم عند التسجيل.</li>
              <li>المستندات التي تُنشئها أو تحفظها في التطبيق.</li>
              <li>بيانات الاستخدام (عدد المستندات، طلبات الذكاء الاصطناعي).</li>
              <li>بيانات المكتب (الاسم، المدينة، الهاتف) التي تُدخلها اختياريًا.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">2. كيف نستخدم بياناتك؟</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              نستخدم بياناتك حصرًا لتقديم خدمة التطبيق — حفظ المستندات، تفعيل الذكاء
              الاصطناعي، وإدارة الاشتراك. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة
              إلا في الحالات المذكورة أدناه.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">3. مزودو الخدمة الخارجيون</h2>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[var(--muted)]">
              <li>
                <strong>Supabase:</strong> قاعدة البيانات والمصادقة — مستضافة في الاتحاد
                الأوروبي أو الولايات المتحدة وفق إعدادات المشروع.
              </li>
              <li>
                <strong>OpenAI (اختياري):</strong> عند استخدام ميزة الذكاء الاصطناعي،
                يُرسَل محتوى المستند جزئيًا إلى OpenAI لمعالجته. لا تُرسَل بيانات تعريفية
                شخصية. راجع{" "}
                <a
                  href="https://openai.com/policies/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  سياسة OpenAI
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">4. أمان البيانات</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              نطبّق سياسات Row Level Security على مستوى قاعدة البيانات — لا يستطيع أي
              مستخدم الاطلاع على مستندات مستخدم آخر. البيانات مشفّرة في النقل (TLS) وفي
              التخزين.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">5. حقوقك</h2>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[var(--muted)]">
              <li>الاطلاع على بياناتك وتصديرها.</li>
              <li>تعديل بياناتك من صفحة الملف الشخصي.</li>
              <li>حذف حسابك ومستنداتك من صفحة الإعدادات (قيد التطوير).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">6. تنبيه قانوني خاص</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              المستندات التي تُنشئها صيغتي تخص موكليك وهي سرية بطبيعتها. لا ترفع
              التطبيق مستنداتك إلى أي خدمة خارجية إلا عند استخدام ميزة الذكاء الاصطناعي
              بشكل صريح. يُنصح بمراجعة متطلبات قانون حماية البيانات المصري ذات الصلة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">7. التواصل</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              لأي استفسارات تتعلق بالخصوصية، تواصل معنا عبر:{" "}
              <span className="font-medium">privacy@sayghty.com</span> (للأغراض
              التوضيحية — يُرجى استبداله بالبريد الفعلي قبل الإطلاق التجاري).
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
