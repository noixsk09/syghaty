import { AppShell } from "@/components/layout/app-shell";
import { getSessionContext } from "@/lib/firm";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

// جميع الصفحات المحمية ديناميكية — تتطلب مصادقة في وقت الطلب
export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!getSupabaseEnv().isConfigured) {
    redirect("/setup-required");
  }

  let ctx;
  try {
    ctx = await getSessionContext();
  } catch {
    redirect("/setup-required");
  }

  if (!ctx) {
    redirect("/login");
  }

  if (!ctx.firm) {
    redirect("/onboarding");
  }

  return (
    <AppShell
      firmName={ctx.firm.name}
      fullName={ctx.profile?.full_name}
      role={ctx.role}
    >
      {children}
    </AppShell>
  );
}
