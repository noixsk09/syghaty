"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DOC_CATEGORY_LABELS, DOC_STATUS_LABELS } from "@/types/database";
import type { DocCategory, DocStatus } from "@/types/database";
import {
  toggleFavoriteAction,
  archiveDraftAction,
  duplicateDraftAction,
} from "@/app/actions/documents";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  FileText,
  Star,
  StarOff,
  Trash2,
  Copy,
  Edit,
  Sparkles,
  Search,
} from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  category: string | null;
  status: string;
  is_favorite: boolean;
  updated_at: string;
  created_at: string;
  ai_generated: boolean;
}

interface Props {
  docs: DocItem[];
}

const CATEGORY_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "civil_contracts", label: "العقود المدنية" },
  { value: "sale_rent", label: "البيع والإيجار" },
  { value: "employment", label: "العمل" },
  { value: "commercial", label: "تجاري" },
  { value: "legal_notices", label: "إنذارات" },
  { value: "lawsuits", label: "دعاوى" },
  { value: "legal_memos", label: "مذكرات" },
  { value: "poa_forms", label: "توكيلات" },
];

export function DocumentsList({ docs: initialDocs }: Props) {
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = docs.filter((d) => {
    const matchSearch =
      !search || d.title.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === "all" || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  function handleToggleFavorite(id: string, current: boolean) {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_favorite: !current } : d)),
    );
    startTransition(() => toggleFavoriteAction(id, !current));
  }

  function handleDelete(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setConfirmDeleteId(null);
    startTransition(() => archiveDraftAction(id));
  }

  async function handleDuplicate(id: string) {
    try {
      const { id: newId } = await duplicateDraftAction(id);
      window.location.href = `/documents/${newId}/edit`;
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-6">
      {/* فلاتر البحث */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في المستندات..."
            className="w-full rounded-lg border border-[var(--border)] bg-white py-2 pr-9 pl-3 text-sm focus:border-[var(--navy)] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setCategoryFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === f.value
                  ? "bg-[var(--navy)] text-white"
                  : "bg-white border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] py-12 text-center text-[var(--muted)]">
          لا توجد نتائج مطابقة
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--surface)] transition-colors">
              <FileText className="h-5 w-5 shrink-0 text-[var(--muted)]" />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/documents/${doc.id}/edit`}
                  className="block truncate font-medium text-[var(--navy)] hover:underline"
                >
                  {doc.title}
                </Link>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  {doc.category && (
                    <span>
                      {DOC_CATEGORY_LABELS[doc.category as DocCategory]}
                    </span>
                  )}
                  <span>·</span>
                  <span>
                    {format(new Date(doc.updated_at), "d MMM yyyy", { locale: ar })}
                  </span>
                  {doc.ai_generated && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Sparkles className="h-3 w-3" /> AI
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    doc.status === "finalized"
                      ? "bg-green-100 text-green-700"
                      : "bg-[var(--surface-muted)] text-[var(--muted)]"
                  }`}
                >
                  {DOC_STATUS_LABELS[doc.status as DocStatus]}
                </span>

                <Link
                  href={`/documents/${doc.id}/edit`}
                  className="rounded p-1.5 hover:bg-[var(--surface-muted)] transition-colors"
                  title="تعديل"
                >
                  <Edit className="h-4 w-4 text-[var(--muted)]" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleFavorite(doc.id, doc.is_favorite)}
                  className="rounded p-1.5 hover:bg-[var(--surface-muted)] transition-colors"
                  title={doc.is_favorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                  {doc.is_favorite ? (
                    <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ) : (
                    <StarOff className="h-4 w-4 text-[var(--muted)]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicate(doc.id)}
                  className="rounded p-1.5 hover:bg-[var(--surface-muted)] transition-colors"
                  title="نسخ"
                >
                  <Copy className="h-4 w-4 text-[var(--muted)]" />
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(doc.id)}
                  className="rounded p-1.5 hover:bg-red-50 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* تأكيد الحذف */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 font-bold text-[var(--navy)]">تأكيد الحذف</h3>
            <p className="mb-5 text-sm text-[var(--muted)]">
              هل أنت متأكد من حذف هذا المستند؟ لا يمكن التراجع.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-lg border border-[var(--border)] py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
