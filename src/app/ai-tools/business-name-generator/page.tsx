
import BusinessNameGeneratorForm from "@/components/business-name-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BusinessNameGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/business-name-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
     <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Lightbulb className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <BusinessNameGeneratorForm />
    </ToolPageLayout>
  );
}
