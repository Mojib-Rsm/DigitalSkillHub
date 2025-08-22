
import DomainNameSuggesterForm from "@/components/domain-name-suggester-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DomainNameSuggesterPage() {
  const tool = await getToolByHref('/ai-tools/domain-name-suggester');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Globe className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <DomainNameSuggesterForm />
    </ToolPageLayout>
  );
}
