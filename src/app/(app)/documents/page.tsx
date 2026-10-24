import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentsList } from "@/components/documents/documents-list";
import { FilePlus } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const ctx = await getSessionContext();

  const { data: docs } = await supabase
    .from("document_drafts")
    .select("id, title, category, status, is_favorite, updated_at, created_at, ai_generated")
    .eq("user_id", ctx!.userId)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="مستنداتي"
        description={`${docs?.length ?? 0} مستند محفوظ`}
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

      {!docs || docs.length === 0 ? (
        <EmptyState
          title="لا توجد مستندات بعد"
          description="أنشئ مستندك القانوني الأول من مكتبة القوالب"
          action={
            <Link
              href="/documents/new"
              className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-600)] transition-colors"
            >
              إنشاء مستند
            </Link>
          }
          className="mt-8"
        />
      ) : (
        <DocumentsList docs={docs} />
      )}
    </div>
  );
}
