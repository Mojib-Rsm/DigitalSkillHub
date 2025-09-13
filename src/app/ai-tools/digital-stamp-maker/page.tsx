
import DigitalStampMakerForm from "@/components/digital-stamp-maker-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Stamp } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DigitalStampMakerPage() {
  const tool = await getToolByHref('/ai-tools/digital-stamp-maker');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Stamp className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <DigitalStampMakerForm />
    </ToolPageLayout>
  );
}
