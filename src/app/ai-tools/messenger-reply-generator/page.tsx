
import MessengerReplyGeneratorForm from "@/components/messenger-reply-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function MessengerReplyGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/messenger-reply-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<MessageCircle className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <MessengerReplyGeneratorForm />
    </ToolPageLayout>
  );
}
