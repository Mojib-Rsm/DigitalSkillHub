
import CoverLetterGeneratorForm from "@/components/cover-letter-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { FileSignature } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CoverLetterGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/cover-letter-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<FileSignature className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
        helperTool={{
            buttonText: "সিভি উন্নত করুন",
            href: "/ai-tools/resume-helper"
        }}
    >
      <CoverLetterGeneratorForm />
    </ToolPageLayout>
  );
}
