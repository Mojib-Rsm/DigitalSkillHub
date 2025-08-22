
import SeoKeywordSuggesterForm from "@/components/seo-keyword-suggester-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { BarChart } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SeoKeywordSuggesterPage() {
  const tool = await getToolByHref('/ai-tools/seo-keyword-suggester');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<BarChart className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <SeoKeywordSuggesterForm />
    </ToolPageLayout>
  );
}
