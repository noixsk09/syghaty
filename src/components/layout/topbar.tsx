"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ROLE_LABELS, type UserRole } from "@/types/database";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Topbar({
  fullName,
  role,
  onMenuClick,
}: {
  fullName?: string | null;
  role?: UserRole | null;
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--navy)] hover:bg-[var(--surface-muted)] lg:hidden"
          onClick={onMenuClick}
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-[var(--navy)]">{fullName || "مستخدم"}</p>
          <p className="text-xs text-[var(--muted)]">
            {role ? ROLE_LABELS[role] : "بدون مكتب مرتبط"}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
        <LogOut className="h-4 w-4" />
        خروج
      </Button>
    </header>
  );
}
