
import StoryPlotGeneratorForm from "@/components/story-plot-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { GitBranchPlus } from "lucide-react";
import { notFound } from "next/navigation";

export default async function StoryPlotGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/story-plot-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<GitBranchPlus className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <StoryPlotGeneratorForm />
    </ToolPageLayout>
  );
}
