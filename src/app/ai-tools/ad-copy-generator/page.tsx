
import AdCopyGeneratorForm from "@/components/ad-copy-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Megaphone } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AdCopyGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/ad-copy-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Megaphone className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <AdCopyGeneratorForm />
    </ToolPageLayout>
  );
}
