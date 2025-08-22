
import BengaliTranslatorForm from "@/components/bengali-translator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Languages } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BengaliTranslatorPage() {
  const tool = await getToolByHref('/ai-tools/bengali-translator');
  if (!tool) notFound();
  
  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Languages className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
        <BengaliTranslatorForm />
    </ToolPageLayout>
  );
}
