import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/firm";
import { DocumentEditor } from "@/components/documents/document-editor";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const ctx = await getSessionContext();

  // جلب المستند مع التحقق من الملكية على الخادم
  const { data: doc } = await supabase
    .from("document_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", ctx!.userId)
    .is("archived_at", null)
    .maybeSingle();

  if (!doc) notFound();

  // جلب بيانات الملف الشخصي للمحامي
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", ctx!.userId)
    .maybeSingle();

  return (
    <DocumentEditor
      doc={doc}
      lawyerName={profile?.full_name ?? undefined}
      firmName={ctx?.firm?.name ?? undefined}
    />
  );
}
