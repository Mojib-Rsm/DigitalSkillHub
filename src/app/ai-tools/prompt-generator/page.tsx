
import PromptGeneratorForm from "@/components/prompt-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PromptGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/prompt-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Sparkles className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <PromptGeneratorForm />
    </ToolPageLayout>
  );
}
