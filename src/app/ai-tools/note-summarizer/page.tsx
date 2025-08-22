
import NoteSummarizerForm from "@/components/note-summarizer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { BookCheck } from "lucide-react";
import { notFound } from "next/navigation";

export default async function NoteSummarizerPage() {
  const tool = await getToolByHref('/ai-tools/note-summarizer');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<BookCheck className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <NoteSummarizerForm />
    </ToolPageLayout>
  );
}
