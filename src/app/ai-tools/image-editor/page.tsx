
import ImageEditorForm from "@/components/image-editor-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Palette } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Image Editor",
  description: "Edit images using text prompts with our advanced AI image editor. Change backgrounds, add objects, and modify styles effortlessly.",
};


export default async function ImageEditorPage() {
  const tool = await getToolByHref('/ai-tools/image-editor');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Palette className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
        helperTool={{
            buttonText: "প্রম্পট তৈরি করুন",
            href: "/ai-tools/prompt-generator"
        }}
    >
      <ImageEditorForm />
    </ToolPageLayout>
  );
}
