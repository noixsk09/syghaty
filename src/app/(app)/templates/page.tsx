import { SYSTEM_TEMPLATES, TEMPLATES_BY_CATEGORY } from "@/lib/templates-data";
import { DOC_CATEGORY_LABELS, type DocCategory } from "@/types/database";
import { PageHeader } from "@/components/ui/page-header";
import { BookOpen, FilePlus } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  const categories = Object.keys(TEMPLATES_BY_CATEGORY) as DocCategory[];

  return (
    <div>
      <PageHeader
        title="مكتبة القوالب القانونية"
        description={`${SYSTEM_TEMPLATES.length} قوالب جاهزة — مسودات أولية تحتاج مراجعة محامٍ`}
      />

      {/* تنبيه */}
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        ⚠️ هذه القوالب نماذج أولية توضيحية. لا تحتوي على أحكام قضائية أو أرقام مواد قانونية حقيقية.
        يجب مراجعة أي مستند قبل التوقيع أو الإيداع الرسمي.
      </div>

      {/* التصنيفات */}
      <div className="mt-8 space-y-8">
        {categories.map((cat) => {
          const templates = TEMPLATES_BY_CATEGORY[cat] ?? [];
          return (
            <section key={cat}>
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--gold)]" />
                <h2 className="text-lg font-bold text-[var(--navy)]">
                  {DOC_CATEGORY_LABELS[cat]}
                </h2>
                <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-[var(--muted)]">
                  {templates.length}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group flex flex-col rounded-xl border border-[var(--border)] bg-white p-5 hover:border-[var(--gold)] hover:shadow-md transition-all"
                  >
                    <h3 className="mb-1 font-bold text-[var(--navy)]">{tpl.name}</h3>
                    <p className="mb-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                      {tpl.description}
                    </p>
                    <div className="mb-3 text-xs text-[var(--muted)]">
                      {tpl.fields.length} حقول إدخال
                    </div>
                    <Link
                      href={`/documents/new?template=${tpl.id}`}
                      className="flex items-center justify-center gap-2 rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-600)] transition-colors"
                    >
                      <FilePlus className="h-4 w-4" />
                      استخدم هذا القالب
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
