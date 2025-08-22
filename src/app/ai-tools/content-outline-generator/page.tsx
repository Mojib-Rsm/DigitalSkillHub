
import ContentOutlineGeneratorForm from "@/components/content-outline-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { List } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ContentOutlineGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/content-outline-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<List className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <ContentOutlineGeneratorForm />
    </ToolPageLayout>
  );
}
