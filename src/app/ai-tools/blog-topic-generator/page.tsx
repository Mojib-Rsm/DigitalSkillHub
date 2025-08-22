
import BlogTopicGeneratorForm from "@/components/blog-topic-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { PenSquare } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BlogTopicGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/blog-topic-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<PenSquare className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <BlogTopicGeneratorForm />
    </ToolPageLayout>
  );
}
