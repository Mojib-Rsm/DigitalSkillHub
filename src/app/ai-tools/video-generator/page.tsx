
import { Film } from "lucide-react";
import VideoGeneratorForm from "@/components/video-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { notFound } from "next/navigation";

export default async function VideoGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/video-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Film className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
        helperTool={{
            buttonText: "প্রম্পট তৈরি করুন",
            href: "/ai-tools/prompt-generator"
        }}
    >
      <VideoGeneratorForm />
    </ToolPageLayout>
  );
}
