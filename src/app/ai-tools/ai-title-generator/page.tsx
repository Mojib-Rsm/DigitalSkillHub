
import AiTitleGeneratorForm from "@/components/ai-title-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Asterisk } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AiTitleGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/ai-title-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Asterisk className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <AiTitleGeneratorForm />
    </ToolPageLayout>
  );
}
