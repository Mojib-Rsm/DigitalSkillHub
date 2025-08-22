
import WebsiteBlueprintGeneratorForm from "@/components/website-blueprint-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { LayoutTemplate } from "lucide-react";
import { notFound } from "next/navigation";

export default async function WebsiteBlueprintGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/website-blueprint-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<LayoutTemplate className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <div className="max-w-4xl mx-auto">
        <WebsiteBlueprintGeneratorForm />
      </div>
    </ToolPageLayout>
  );
}
