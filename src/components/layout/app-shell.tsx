"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { UserRole } from "@/types/database";
import { useState } from "react";

export function AppShell({
  children,
  firmName,
  fullName,
  role,
}: {
  children: React.ReactNode;
  firmName?: string | null;
  fullName?: string | null;
  role?: UserRole | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <div className="hidden lg:block">
        <Sidebar firmName={firmName} />
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="إغلاق القائمة"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-64 shadow-xl">
            <Sidebar firmName={firmName} />
          </div>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar fullName={fullName} role={role} onMenuClick={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
