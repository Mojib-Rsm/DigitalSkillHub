
import FreelanceIdeaGeneratorForm from "@/components/freelance-idea-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Wand } from "lucide-react";
import { notFound } from "next/navigation";

export default async function FreelanceIdeaGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/freelance-idea-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Wand className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <FreelanceIdeaGeneratorForm />
    </ToolPageLayout>
  );
}
