import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DOC_CATEGORY_LABELS } from "@/types/database";
import {
  FileText,
  FilePlus,
  Star,
  Clock,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default async function DashboardPage() {
  const supabase = await createClient();
  const ctx = await getSessionContext();

  // إحصائيات
  const [{ count: totalDocs }, { data: recentDocs }, { data: subscription }] =
    await Promise.all([
      supabase
        .from("document_drafts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", ctx!.userId)
        .is("archived_at", null),

      supabase
        .from("document_drafts")
        .select("id, title, category, status, updated_at, is_favorite")
        .eq("user_id", ctx!.userId)
        .is("archived_at", null)
        .order("updated_at", { ascending: false })
        .limit(5),

      supabase
        .from("user_subscriptions")
        .select("plan, docs_used, ai_used, expires_at")
        .eq("user_id", ctx!.userId)
        .eq("status", "active")
        .maybeSingle(),
    ]);

  const planLimit = subscription?.plan === "free" ? 5 : subscription?.plan === "professional" ? 50 : -1;

  const stats = [
    {
      label: "المستندات المُنشأة",
      value: totalDocs ?? 0,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "استُخدم هذا الشهر",
      value: `${subscription?.docs_used ?? 0}${planLimit !== -1 ? ` / ${planLimit}` : ""}`,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "طلبات AI هذا الشهر",
      value: subscription?.ai_used ?? 0,
      icon: Star,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "خطتك الحالية",
      value:
        subscription?.plan === "free"
          ? "مجانية"
          : subscription?.plan === "professional"
            ? "احترافية"
            : subscription?.plan === "firm"
              ? "مكتب"
              : "مجانية",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div>
      <PageHeader
        title={`مرحباً، ${ctx?.profile?.full_name?.split(" ")[0] ?? "محامي"} 👋`}
        description="لوحة تحكم صيغتي — إنشاء مستنداتك القانونية في لحظات"
        actions={
          <Link
            href="/documents/new"
            className="flex items-center gap-2 rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-600)] transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            مستند جديد
          </Link>
        }
      />

      {/* إحصائيات */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[var(--navy)]">{value}</p>
              </div>
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* التنقل السريع */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/documents/new"
          className="group flex flex-col items-center rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center hover:border-[var(--gold)] hover:bg-[var(--gold-soft)] transition-all"
        >
          <FilePlus className="mb-3 h-8 w-8 text-[var(--gold)] group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-[var(--navy)]">إنشاء مستند جديد</p>
          <p className="mt-1 text-xs text-[var(--muted)]">ابدأ من قالب أو من الصفر</p>
        </Link>
        <Link
          href="/templates"
          className="group flex flex-col items-center rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center hover:border-[var(--gold)] hover:bg-[var(--gold-soft)] transition-all"
        >
          <BookOpen className="mb-3 h-8 w-8 text-[var(--gold)] group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-[var(--navy)]">مكتبة القوالب</p>
          <p className="mt-1 text-xs text-[var(--muted)]">تصفح جميع القوالب القانونية</p>
        </Link>
        <Link
          href="/documents/favorites"
          className="group flex flex-col items-center rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center hover:border-[var(--gold)] hover:bg-[var(--gold-soft)] transition-all"
        >
          <Star className="mb-3 h-8 w-8 text-[var(--gold)] group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-[var(--navy)]">المفضلة</p>
          <p className="mt-1 text-xs text-[var(--muted)]">المستندات المُحفَّظة</p>
        </Link>
      </div>

      {/* آخر المستندات */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--navy)]">
            <Clock className="ml-2 inline h-4 w-4" />
            آخر المستندات المُعدَّلة
          </h2>
          <Link href="/documents" className="text-sm text-[var(--muted)] hover:text-[var(--navy)] transition-colors">
            عرض الكل
          </Link>
        </div>

        {!recentDocs || recentDocs.length === 0 ? (
          <EmptyState
            title="لا توجد مستندات بعد"
            description="ابدأ بإنشاء مستندك القانوني الأول من مكتبة القوالب"
            action={<Link href="/documents/new" className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-600)] transition-colors">إنشاء مستند</Link>}
          />
        ) : (
          <div className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}/edit`}
                className="flex items-center justify-between px-5 py-4 hover:bg-[var(--surface)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 shrink-0 text-[var(--muted)]" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--navy)]">{doc.title}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {doc.category
                        ? DOC_CATEGORY_LABELS[doc.category as keyof typeof DOC_CATEGORY_LABELS]
                        : "—"}{" "}
                      · آخر تعديل{" "}
                      {format(new Date(doc.updated_at), "d MMM yyyy", { locale: ar })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.is_favorite && (
                    <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      doc.status === "finalized"
                        ? "bg-green-100 text-green-700"
                        : "bg-[var(--surface-muted)] text-[var(--muted)]"
                    }`}
                  >
                    {doc.status === "finalized" ? "مكتمل" : "مسودة"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
