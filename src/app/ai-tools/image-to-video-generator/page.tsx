
import { Clapperboard } from "lucide-react";
import ImageToVideoGeneratorForm from "@/components/image-to-video-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { notFound } from "next/navigation";

export default async function ImageToVideoGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/image-to-video-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Clapperboard className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
        <ImageToVideoGeneratorForm />
    </ToolPageLayout>
  );
}
