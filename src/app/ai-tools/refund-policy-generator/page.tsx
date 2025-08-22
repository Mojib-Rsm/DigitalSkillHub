
import RefundPolicyGeneratorForm from "@/components/refund-policy-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Receipt } from "lucide-react";
import { notFound } from "next/navigation";

export default async function RefundPolicyGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/refund-policy-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Receipt className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <RefundPolicyGeneratorForm />
    </ToolPageLayout>
  );
}
