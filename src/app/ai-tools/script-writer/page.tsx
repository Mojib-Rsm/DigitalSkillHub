
import ScriptWriterForm from "@/components/script-writer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Youtube } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ScriptWriterPage() {
  const tool = await getToolByHref('/ai-tools/script-writer');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Youtube className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <ScriptWriterForm />
    </ToolPageLayout>
  );
}
