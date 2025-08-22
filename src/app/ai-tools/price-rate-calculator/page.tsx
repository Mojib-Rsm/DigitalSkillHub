
import PriceRateCalculatorForm from "@/components/price-rate-calculator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { DollarSign } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PriceRateCalculatorPage() {
  const tool = await getToolByHref('/ai-tools/price-rate-calculator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<DollarSign className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <PriceRateCalculatorForm />
    </ToolPageLayout>
  );
}
