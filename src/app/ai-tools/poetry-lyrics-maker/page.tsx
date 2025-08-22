
import PoetryLyricsMakerForm from "@/components/poetry-lyrics-maker-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Mic } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PoetryLyricsMakerPage() {
  const tool = await getToolByHref('/ai-tools/poetry-lyrics-maker');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Mic className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <PoetryLyricsMakerForm />
    </ToolPageLayout>
  );
}
