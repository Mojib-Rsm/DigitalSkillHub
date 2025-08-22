
import SocialMediaPostGeneratorForm from "@/components/social-media-post-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Hash } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SocialMediaPostGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/social-media-post-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Hash className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <SocialMediaPostGeneratorForm />
    </ToolPageLayout>
  );
}
