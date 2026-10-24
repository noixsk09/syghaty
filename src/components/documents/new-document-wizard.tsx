"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TemplateDefinition } from "@/lib/templates-data";
import { fillTemplate } from "@/lib/templates-data";
import { DOC_CATEGORY_LABELS, DRAFTING_STYLE_LABELS, type DocCategory, type DraftingStyle } from "@/types/database";
import { createDraftAction } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, Eye } from "lucide-react";

interface Props {
  template: TemplateDefinition | null;
  allTemplates: TemplateDefinition[];
}

type Step = "select-template" | "fill-form" | "choose-style" | "review";

export function NewDocumentWizard({ template, allTemplates }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(template ? "fill-form" : "select-template");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(template);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState(template?.name ?? "");
  const [style, setStyle] = useState<DraftingStyle>("formal");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  const STEPS: Step[] = ["select-template", "fill-form", "choose-style", "review"];
  const stepLabels = ["اختيار القالب", "إدخال البيانات", "أسلوب الصياغة", "المراجعة"];
  const currentStepIndex = STEPS.indexOf(step);

  function next() {
    setError(null);
    const idx = STEPS.indexOf(step);
    if (step === "fill-form" && !title.trim()) {
      setError("يرجى إدخال عنوان للمستند.");
      return;
    }
    if (idx < STEPS.length - 1) {
      const nextStep = STEPS[idx + 1];
      if (nextStep === "review") {
        // توليد معاينة من القالب
        const body = selectedTemplate
          ? fillTemplate(selectedTemplate.bodyTemplate, formData, selectedTemplate.fields)
          : "";
        setPreview(body);
      }
      setStep(nextStep);
    }
  }

  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  function handleFieldChange(fieldId: string, value: string) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function handleGenerateWithAi() {
    if (!selectedTemplate) return;
    setAiLoading(true);
    setAiWarning(null);
    try {
      const body = fillTemplate(selectedTemplate.bodyTemplate, formData, selectedTemplate.fields);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "generate_draft",
          documentType: selectedTemplate.name,
          currentContent: body,
          formData,
          style,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "حدث خطأ");
      setPreview(data.result);
      if (data.isDemo || data.warning) setAiWarning(data.warning ?? "وضع تجريبي");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ في الاتصال بخدمة الذكاء الاصطناعي.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleCreate(aiGenerated: boolean) {
    if (!selectedTemplate) return;
    setLoading(true);
    setError(null);
    try {
      const content = preview ?? fillTemplate(selectedTemplate.bodyTemplate, formData, selectedTemplate.fields);
      const { id } = await createDraftAction({
        title: title.trim() || selectedTemplate.name,
        category: selectedTemplate.category as DocCategory,
        templateId: selectedTemplate.id.startsWith("sys-") ? null : selectedTemplate.id,
        draftingStyle: style,
        formData,
        content,
        aiGenerated,
      });
      router.push(`/documents/${id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ أثناء إنشاء المستند.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {/* شريط الخطوات */}
      <div className="mb-8 flex items-center gap-0 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                i < currentStepIndex
                  ? "bg-green-500 text-white"
                  : i === currentStepIndex
                    ? "bg-[var(--navy)] text-white"
                    : "bg-[var(--surface-muted)] text-[var(--muted)]",
              )}
            >
              {i < currentStepIndex ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "mx-2 whitespace-nowrap text-sm",
                i === currentStepIndex ? "font-bold text-[var(--navy)]" : "text-[var(--muted)]",
              )}
            >
              {stepLabels[i]}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-px w-8 bg-[var(--border)]" />
            )}
          </div>
        ))}
      </div>

      {/* محتوى الخطوة */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-6">
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        {/* الخطوة 1: اختيار القالب */}
        {step === "select-template" && (
          <div>
            <h3 className="mb-4 text-base font-bold text-[var(--navy)]">اختر نوع المستند</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setTitle(tpl.name);
                    setFormData({});
                  }}
                  className={cn(
                    "rounded-xl border-2 p-4 text-right transition-all hover:shadow-md",
                    selectedTemplate?.id === tpl.id
                      ? "border-[var(--gold)] bg-[var(--gold-soft)]"
                      : "border-[var(--border)] bg-white",
                  )}
                >
                  <p className="font-semibold text-[var(--navy)]">{tpl.name}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {DOC_CATEGORY_LABELS[tpl.category]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 2: إدخال البيانات */}
        {step === "fill-form" && selectedTemplate && (
          <div>
            <h3 className="mb-1 text-base font-bold text-[var(--navy)]">
              {selectedTemplate.name}
            </h3>
            <p className="mb-5 text-sm text-[var(--muted)]">
              الحقول الفارغة ستظهر كـ [[اسم الحقل]] في المسودة
            </p>

            <div className="mb-5">
              <Label htmlFor="doc-title">عنوان المستند *</Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: عقد بيع شقة سكنية"
                className="mt-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {selectedTemplate.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === "textarea" ? "sm:col-span-2" : ""}
                >
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="mr-1 text-red-500">*</span>}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      value={formData[field.id] ?? ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="mt-1"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.id}
                      value={formData[field.id] ?? ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-[var(--navy)] focus:outline-none"
                    >
                      <option value="">اختر...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type === "date" ? "date" : field.type === "number" || field.type === "currency" ? "number" : "text"}
                      value={formData[field.id] ?? ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 3: أسلوب الصياغة */}
        {step === "choose-style" && (
          <div>
            <h3 className="mb-4 text-base font-bold text-[var(--navy)]">
              اختر أسلوب الصياغة
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {(Object.entries(DRAFTING_STYLE_LABELS) as [DraftingStyle, string][]).map(
                ([s, label]) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={cn(
                      "rounded-xl border-2 p-5 text-right transition-all",
                      style === s
                        ? "border-[var(--gold)] bg-[var(--gold-soft)]"
                        : "border-[var(--border)] bg-white hover:shadow-md",
                    )}
                  >
                    <p className="font-bold text-[var(--navy)]">{label}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {s === "concise"
                        ? "نص قصير ومباشر يركز على الجوهر"
                        : s === "detailed"
                          ? "تفاصيل كاملة وشروط مُوسَّعة"
                          : "لغة قانونية رسمية بالأسلوب المصري"}
                    </p>
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* الخطوة 4: المراجعة */}
        {step === "review" && (
          <div>
            <h3 className="mb-2 text-base font-bold text-[var(--navy)]">
              مراجعة المسودة
            </h3>
            <p className="mb-4 text-sm text-[var(--muted)]">
              راجع المسودة — يمكنك تعديلها كاملاً في المحرر بعد الإنشاء
            </p>

            {aiWarning && (
              <Alert variant="warning" className="mb-3">
                {aiWarning}
              </Alert>
            )}

            <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--navy)] font-sans">
                {preview}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={handleGenerateWithAi}
                disabled={aiLoading || loading}
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                تحسين بالذكاء الاصطناعي
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const body = selectedTemplate
                    ? fillTemplate(selectedTemplate.bodyTemplate, formData, selectedTemplate.fields)
                    : "";
                  setPreview(body);
                }}
              >
                <Eye className="h-4 w-4" />
                إعادة توليد من القالب
              </Button>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              ⚠️ هذه مسودة أولية تحتاج مراجعة محامٍ قبل الاستخدام الرسمي.
              الحقول التي تظهر كـ [[...]] تحتاج إلى تعبئة.
            </div>
          </div>
        )}
      </div>

      {/* أزرار التنقل */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={back}
          disabled={currentStepIndex === 0 || loading}
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>

        {step !== "review" ? (
          <Button
            onClick={next}
            disabled={
              (step === "select-template" && !selectedTemplate) || loading
            }
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => handleCreate(false)}
            disabled={loading || aiLoading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            إنشاء المستند والانتقال للمحرر
          </Button>
        )}
      </div>
    </div>
  );
}
