
import HeadlineGeneratorForm from "@/components/headline-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { PanelTopOpen } from "lucide-react";
import { notFound } from "next/navigation";

export default async function HeadlineGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/headline-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<PanelTopOpen className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <HeadlineGeneratorForm />
    </ToolPageLayout>
  );
}
