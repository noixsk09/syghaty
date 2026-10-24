import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { User, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const ctx = await getSessionContext();

  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("plan, docs_used, ai_used, status, expires_at")
    .eq("user_id", ctx!.userId)
    .eq("status", "active")
    .maybeSingle();

  const planNames: Record<string, string> = {
    free: "مجانية",
    professional: "احترافية",
    firm: "مكتب المحاماة",
  };

  return (
    <div>
      <PageHeader title="الملف الشخصي" description="إدارة بياناتك الشخصية" />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* نموذج الملف الشخصي */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--gold)]" />
              <h2 className="font-bold text-[var(--navy)]">البيانات الشخصية</h2>
            </div>
            <ProfileForm
              userId={ctx!.userId}
              email={ctx!.email}
              profile={ctx!.profile}
            />
          </Card>
        </div>

        {/* معلومات الاشتراك */}
        <div>
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[var(--gold)]" />
              <h2 className="font-bold text-[var(--navy)]">الاشتراك الحالي</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">الخطة</span>
                <span className="rounded-full bg-[var(--gold-soft)] px-3 py-1 text-sm font-bold text-[var(--navy)]">
                  {planNames[sub?.plan ?? "free"] ?? "مجانية"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">المستندات هذا الشهر</span>
                <span className="text-sm font-medium text-[var(--navy)]">
                  {sub?.docs_used ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">طلبات AI</span>
                <span className="text-sm font-medium text-[var(--navy)]">
                  {sub?.ai_used ?? 0}
                </span>
              </div>
              <div className="pt-3">
                <Link
                  href="/pricing"
                  className="block w-full rounded-lg border border-[var(--border)] py-2 text-center text-sm font-medium text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
                >
                  عرض خطط الاشتراك
                </Link>
              </div>
            </div>
          </Card>

          {/* إعدادات الحساب */}
          <Card className="mt-4 p-6">
            <h2 className="mb-4 font-bold text-[var(--navy)]">إدارة الحساب</h2>
            <div className="space-y-2">
              <Link
                href="/settings"
                className="block rounded-lg px-3 py-2 text-sm text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
              >
                إعدادات التطبيق
              </Link>
              <Link
                href="/privacy"
                className="block rounded-lg px-3 py-2 text-sm text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="block rounded-lg px-3 py-2 text-sm text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
              >
                شروط الاستخدام
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
