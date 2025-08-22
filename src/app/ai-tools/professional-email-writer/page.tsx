
import ProfessionalEmailWriterForm from "@/components/professional-email-writer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProfessionalEmailWriterPage() {
  const tool = await getToolByHref('/ai-tools/professional-email-writer');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Mail className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <ProfessionalEmailWriterForm />
    </ToolPageLayout>
  );
}
