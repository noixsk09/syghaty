"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { DocumentDraft } from "@/types/database";
import { DOC_CATEGORY_LABELS, DOC_STATUS_LABELS } from "@/types/database";
import {
  updateDraftContentAction,
  updateDraftTitleAction,
  toggleFavoriteAction,
  archiveDraftAction,
  duplicateDraftAction,
} from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Save,
  Download,
  Star,
  StarOff,
  Trash2,
  Copy,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Eye,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Props {
  doc: DocumentDraft;
  lawyerName?: string;
  firmName?: string;
}

export function DocumentEditor({ doc, lawyerName, firmName }: Props) {
  const [content, setContent] = useState(doc.content);
  const [title, setTitle] = useState(doc.title);
  const [isFavorite, setIsFavorite] = useState(doc.is_favorite);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTask, setAiTask] = useState<string | null>(null);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  // ==============================
  // حفظ تلقائي كل 30 ثانية
  // ==============================
  const saveContent = useCallback(
    async (ver = false) => {
      setSaving(true);
      setError(null);
      try {
        await updateDraftContentAction(doc.id, content, ver);
        setSaved(true);
        isDirty.current = false;
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "فشل الحفظ.");
      } finally {
        setSaving(false);
      }
    },
    [doc.id, content],
  );

  useEffect(() => {
    isDirty.current = true;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (isDirty.current) saveContent(false);
    }, 30_000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [content, saveContent]);

  // ==============================
  // تحديث العنوان
  // ==============================
  async function handleTitleBlur() {
    if (title.trim() === doc.title) return;
    try {
      await updateDraftTitleAction(doc.id, title.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل تحديث العنوان.");
    }
  }

  // ==============================
  // المفضلة
  // ==============================
  async function handleToggleFavorite() {
    const newVal = !isFavorite;
    setIsFavorite(newVal);
    await toggleFavoriteAction(doc.id, newVal);
  }

  // ==============================
  // نسخ النص
  // ==============================
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      setError("تعذّر النسخ — يرجى النسخ يدويًا.");
    }
  }

  // ==============================
  // التصدير
  // ==============================
  async function handleExport(format: "txt" | "docx" | "pdf") {
    setError(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, content, title, lawyerName, firmName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "فشل التصدير.");
      }

      if (format === "pdf") {
        const html = await res.text();
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
        }
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل التصدير.");
    }
  }

  // ==============================
  // الذكاء الاصطناعي
  // ==============================
  async function callAi(task: string) {
    setAiLoading(true);
    setAiTask(task);
    setAiWarning(null);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          documentType: doc.category ? DOC_CATEGORY_LABELS[doc.category] : "مستند قانوني",
          currentContent: content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "حدث خطأ");
      setContent(data.result);
      if (data.isDemo || data.warning) setAiWarning(data.warning ?? "وضع تجريبي");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ في الاتصال بالذكاء الاصطناعي.");
    } finally {
      setAiLoading(false);
      setAiTask(null);
    }
  }

  // ==============================
  // الحذف
  // ==============================
  async function handleDelete() {
    setDeleting(true);
    try {
      await archiveDraftAction(doc.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل الحذف.");
      setDeleting(false);
    }
  }

  // ==============================
  // نسخ المستند
  // ==============================
  async function handleDuplicate() {
    try {
      const { id } = await duplicateDraftAction(doc.id);
      window.location.href = `/documents/${id}/edit`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل النسخ.");
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {/* رأس المحرر */}
      <div className="shrink-0 border-b border-[var(--border)] bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <Link href="/documents" className="text-[var(--muted)] hover:text-[var(--navy)]">
                <ArrowRight className="h-4 w-4" />
              </Link>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="min-w-0 flex-1 border-none bg-transparent text-base font-bold text-[var(--navy)] focus:outline-none focus:ring-0"
                placeholder="عنوان المستند"
              />
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
              {doc.category && (
                <span>{DOC_CATEGORY_LABELS[doc.category]}</span>
              )}
              <span>·</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5",
                  doc.status === "finalized"
                    ? "bg-green-100 text-green-700"
                    : "bg-[var(--surface-muted)] text-[var(--muted)]",
                )}
              >
                {DOC_STATUS_LABELS[doc.status]}
              </span>
              {saving && <span className="text-[var(--muted)]">جاري الحفظ...</span>}
              {saved && (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="h-3 w-3" /> تم الحفظ
                </span>
              )}
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className="rounded-lg p-2 hover:bg-[var(--surface)] transition-colors"
              title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              {isFavorite ? (
                <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
              ) : (
                <StarOff className="h-4 w-4 text-[var(--muted)]" />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg p-2 hover:bg-[var(--surface)] transition-colors"
              title="نسخ النص"
            >
              <Copy className="h-4 w-4 text-[var(--muted)]" />
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => saveContent(true)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ
            </Button>

            {/* التصدير */}
            <div className="relative group">
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
              <div className="absolute left-0 top-full z-10 mt-1 hidden w-36 rounded-xl border border-[var(--border)] bg-white p-1 shadow-lg group-hover:block">
                {(["txt", "docx", "pdf"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleExport(fmt)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDuplicate}
              className="rounded-lg p-2 hover:bg-[var(--surface)] transition-colors"
              title="نسخ المستند"
            >
              <RefreshCw className="h-4 w-4 text-[var(--muted)]" />
            </button>

            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="rounded-lg p-2 hover:bg-red-50 transition-colors"
              title="حذف المستند"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* أدوات الذكاء الاصطناعي */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--gold-soft)] px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--gold)]" />
          <span className="text-xs font-medium text-[var(--navy)]">مساعد الذكاء الاصطناعي:</span>
          {[
            { task: "improve_language", label: "تحسين اللغة" },
            { task: "reorganize", label: "إعادة تنظيم" },
            { task: "proofread", label: "تدقيق إملائي" },
            { task: "suggest_missing", label: "اقتراح الناقص" },
            { task: "summarize", label: "تلخيص" },
          ].map(({ task, label }) => (
            <button
              key={task}
              type="button"
              onClick={() => callAi(task)}
              disabled={aiLoading}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium text-[var(--navy)] hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
            >
              {aiLoading && aiTask === task ? (
                <Loader2 className="inline h-3 w-3 animate-spin" />
              ) : null}{" "}
              {label}
            </button>
          ))}
        </div>
        {aiWarning && (
          <p className="mt-1 text-xs text-amber-600">⚠️ {aiWarning}</p>
        )}
      </div>

      {/* رسائل الخطأ */}
      {error && (
        <Alert variant="error" className="shrink-0 mx-4 mt-3">
          {error}
        </Alert>
      )}

      {/* منطقة التحرير */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          dir="rtl"
          className="h-full w-full resize-none bg-white p-6 font-sans text-sm leading-relaxed text-[var(--navy)] focus:outline-none"
          placeholder="ابدأ كتابة المستند هنا..."
          spellCheck={false}
        />
      </div>

      {/* شريط الحالة السفلي */}
      <div className="shrink-0 border-t border-[var(--border)] bg-white px-4 py-2 text-xs text-[var(--muted)]">
        <div className="flex items-center justify-between">
          <span>
            {content.split(/\s+/).filter(Boolean).length} كلمة ·{" "}
            {content.length} حرف
          </span>
          <span>⚠️ مسودة — تحتاج مراجعة محامٍ قبل الاستخدام الرسمي</span>
        </div>
      </div>

      {/* تأكيد الحذف */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 font-bold text-[var(--navy)]">تأكيد الحذف</h3>
            <p className="mb-5 text-sm text-[var(--muted)]">
              هل أنت متأكد من حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حذف نهائيًا
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
