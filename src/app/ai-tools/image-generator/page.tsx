
import ImageGeneratorForm from "@/components/image-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Image } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ImageGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/image-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Image className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
        helperTool={{
            buttonText: "প্রম্পট তৈরি করুন",
            href: "/ai-tools/prompt-generator"
        }}
    >
      <ImageGeneratorForm />
    </ToolPageLayout>
  );
}
