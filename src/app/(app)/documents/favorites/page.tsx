import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentsList } from "@/components/documents/documents-list";
import Link from "next/link";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const ctx = await getSessionContext();

  const { data: docs } = await supabase
    .from("document_drafts")
    .select("id, title, category, status, is_favorite, updated_at, created_at, ai_generated")
    .eq("user_id", ctx!.userId)
    .eq("is_favorite", true)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="المستندات المفضلة"
        description={`${docs?.length ?? 0} مستند مُحفَّظ`}
      />

      {!docs || docs.length === 0 ? (
        <EmptyState
          title="لا توجد مستندات مفضلة"
          description="أضف مستنداتك المهمة للمفضلة من أيقونة النجمة في المحرر"
          action={
            <Link
              href="/documents"
              className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-600)] transition-colors"
            >
              عرض جميع المستندات
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
