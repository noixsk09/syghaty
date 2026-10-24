import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/settings-form";
import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const ctx = await getSessionContext();

  // جلب بيانات المكتب إن وُجد
  const firmName = ctx?.firm?.name ?? null;
  const firmCity = ctx?.firm?.city ?? null;
  const firmPhone = ctx?.firm?.phone ?? null;

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        description="إعدادات التطبيق وبيانات المكتب"
      />

      <div className="mt-6 space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-[var(--navy)]">بيانات المكتب</h2>
          <SettingsForm
            firmId={ctx?.firm?.id ?? null}
            firmName={firmName}
            firmCity={firmCity}
            firmPhone={firmPhone}
            userId={ctx!.userId}
          />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-[var(--navy)]">إعدادات الذكاء الاصطناعي</h2>
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>
              نموذج AI الحالي:{" "}
              <code className="rounded bg-[var(--surface)] px-2 py-0.5 text-xs">
                {process.env.AI_MODEL ?? "gpt-4o-mini (افتراضي)"}
              </code>
            </p>
            <p>
              لتغيير مزود AI أو النموذج، عدّل{" "}
              <code className="rounded bg-[var(--surface)] px-2 py-0.5 text-xs">.env.local</code>{" "}
              وأعِد تشغيل التطبيق.
            </p>
            <div className="rounded-lg bg-[var(--surface)] p-3 text-xs font-mono">
              <p>AI_PROVIDER=openai</p>
              <p>OPENAI_API_KEY=sk-...</p>
              <p>AI_MODEL=gpt-4o-mini</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-red-600">منطقة الخطر</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">
            حذف الحساب يؤدي إلى حذف جميع مستنداتك بشكل نهائي ولا يمكن التراجع عنه.
          </p>
          <button
            type="button"
            disabled
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-500 cursor-not-allowed"
            title="قيد التطوير"
          >
            حذف الحساب (قيد التطوير)
          </button>
        </Card>
      </div>
    </div>
  );
}
