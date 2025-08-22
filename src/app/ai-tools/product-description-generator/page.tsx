
import ProductDescriptionGeneratorForm from "@/components/product-description-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProductDescriptionGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/product-description-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<ShoppingCart className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <ProductDescriptionGeneratorForm />
    </ToolPageLayout>
  );
}
