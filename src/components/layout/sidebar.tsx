"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  BookOpen,
  Star,
  User,
  CreditCard,
  Scale,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/templates", label: "مكتبة القوالب", icon: BookOpen },
  { href: "/documents/new", label: "مستند جديد", icon: FilePlus },
  { href: "/documents", label: "مستنداتي", icon: FileText },
  { href: "/documents/favorites", label: "المفضلة", icon: Star },
  { href: "/profile", label: "الملف الشخصي", icon: User },
  { href: "/pricing", label: "الاشتراكات", icon: CreditCard },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export function Sidebar({ firmName }: { firmName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-l border-[var(--border)] bg-[var(--navy)] text-white">
      {/* الشعار */}
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gold)] text-[var(--navy)]">
            <Scale className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide">صيغتي</p>
            <p className="text-xs text-white/70">Sayghty</p>
          </div>
        </div>
        {firmName ? (
          <p className="mt-4 truncate rounded-md bg-white/10 px-3 py-2 text-xs text-white/90">
            {firmName}
          </p>
        ) : null}
      </div>

      {/* روابط التنقل */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-3"
        aria-label="القائمة الرئيسية"
      >
        {links.map(({ href, label, icon: Icon }) => {
          // /documents/new لا يُنشَّط عند /documents/xxx/edit
          const active =
            href === "/documents"
              ? pathname === "/documents"
              : href === "/documents/new"
                ? pathname === "/documents/new"
                : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[var(--gold)] text-[var(--navy)] font-semibold"
                  : "text-white/85 hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* تنبيه قانوني صغير */}
      <div className="border-t border-white/10 p-4">
        <p className="text-[10px] leading-relaxed text-white/50">
          المستندات المُنشأة مسودات أولية تحتاج مراجعة محامٍ قبل الاستخدام الرسمي.
        </p>
      </div>
    </aside>
  );
}
