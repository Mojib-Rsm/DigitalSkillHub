
import ResumeHelperForm from "@/components/resume-helper-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ResumeHelperPage() {
  const tool = await getToolByHref('/ai-tools/resume-helper');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<FileText className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <ResumeHelperForm />
    </ToolPageLayout>
  );
}
