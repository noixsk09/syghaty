import { getTemplateById, SYSTEM_TEMPLATES } from "@/lib/templates-data";
import { NewDocumentWizard } from "@/components/documents/new-document-wizard";
import { PageHeader } from "@/components/ui/page-header";

interface Props {
  searchParams: Promise<{ template?: string }>;
}

export default async function NewDocumentPage({ searchParams }: Props) {
  const { template: templateId } = await searchParams;
  const template = templateId ? getTemplateById(templateId) : undefined;

  return (
    <div>
      <PageHeader
        title={template ? `إنشاء ${template.name}` : "مستند جديد"}
        description="أدخل بيانات المستند ثم ولِّد المسودة"
      />
      <NewDocumentWizard template={template ?? null} allTemplates={SYSTEM_TEMPLATES} />
    </div>
  );
}
