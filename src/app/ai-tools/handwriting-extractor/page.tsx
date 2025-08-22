
import HandwritingExtractorForm from "@/components/handwriting-extractor-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Edit } from "lucide-react";
import { notFound } from "next/navigation";

export default async function HandwritingExtractorPage() {
  const tool = await getToolByHref('/ai-tools/handwriting-extractor');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Edit className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <div className="max-w-4xl mx-auto">
        <HandwritingExtractorForm />
      </div>
    </ToolPageLayout>
  );
}
