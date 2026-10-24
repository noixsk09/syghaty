import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";
import { PageHeader } from "@/components/ui/page-header";
import { Check } from "lucide-react";

export default async function PricingPage() {
  const supabase = await createClient();
  const ctx = await getSessionContext();

  const [{ data: plans }, { data: currentSub }] = await Promise.all([
    supabase
      .from("subscription_plans_config")
      .select("*")
      .eq("is_active", true)
      .order("price_egp", { ascending: true }),

    supabase
      .from("user_subscriptions")
      .select("plan, docs_used, ai_used, status")
      .eq("user_id", ctx!.userId)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const currentPlan = currentSub?.plan ?? "free";

  const planColors: Record<string, string> = {
    free: "border-[var(--border)]",
    professional: "border-[var(--gold)] shadow-lg",
    firm: "border-[var(--navy)]",
  };

  const planBadge: Record<string, string | null> = {
    free: null,
    professional: "الأكثر طلبًا",
    firm: null,
  };

  return (
    <div>
      <PageHeader
        title="خطط الاشتراك"
        description="اختر الخطة المناسبة لاحتياجاتك القانونية"
      />

      {/* تنبيه: الدفع تجريبي */}
      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        🔧 بوابة الدفع قيد التطوير — الترقية ليست متاحة حاليًا. يمكنك الاستمتاع بالخطة المجانية في الوقت الراهن.
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {plans?.map((plan) => {
          const isCurrentPlan = plan.plan === currentPlan;
          const features = Array.isArray(plan.features)
            ? plan.features
            : (plan.features as unknown as string[]) ?? [];

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 ${planColors[plan.plan] ?? "border-[var(--border)]"}`}
            >
              {planBadge[plan.plan] && (
                <div className="absolute -top-3 right-6 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-[var(--navy)]">
                  {planBadge[plan.plan]}
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-[var(--navy)]">{plan.name_ar}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{plan.description_ar}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[var(--navy)]">
                    {plan.price_egp === 0 ? "مجاني" : `${plan.price_egp} ج.م`}
                  </span>
                  {plan.price_egp > 0 && (
                    <span className="text-sm text-[var(--muted)]"> / شهريًا</span>
                  )}
                </div>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-[var(--navy)]">{feat}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div className="rounded-lg bg-[var(--gold-soft)] py-2 text-center text-sm font-bold text-[var(--navy)]">
                  خطتك الحالية ✓
                </div>
              ) : (
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-[var(--surface-muted)] py-2 text-sm font-medium text-[var(--muted)] cursor-not-allowed"
                  title="الدفع قيد التطوير"
                >
                  قريبًا
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <h3 className="font-bold text-[var(--navy)]">هل تحتاج خطة مخصصة؟</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          للمكاتب الكبيرة والاحتياجات الخاصة، تواصل معنا لمناقشة خطة مناسبة.
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          📧 info@sayghty.com (للأغراض التوضيحية — يُرجى استبداله بالبريد الفعلي)
        </p>
      </div>
    </div>
  );
}
