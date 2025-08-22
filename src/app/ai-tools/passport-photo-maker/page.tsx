
import PassportPhotoMakerForm from "@/components/passport-photo-maker-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { UserCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PassportPhotoMakerPage() {
  const tool = await getToolByHref('/ai-tools/passport-photo-maker');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<UserCircle className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
        <PassportPhotoMakerForm />
    </ToolPageLayout>
  );
}
