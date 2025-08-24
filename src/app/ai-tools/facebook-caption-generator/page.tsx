
import FacebookCaptionGeneratorForm from "@/components/facebook-caption-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";

export default async function FacebookCaptionGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/facebook-caption-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<MessageSquare className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <FacebookCaptionGeneratorForm />
    </ToolPageLayout>
  );
}
