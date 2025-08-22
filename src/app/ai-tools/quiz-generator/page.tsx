
import QuizGeneratorForm from "@/components/quiz-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { HelpCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function QuizGeneratorPage() {
  const tool = await getToolByHref('/ai-tools/quiz-generator');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<HelpCircle className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <QuizGeneratorForm />
    </ToolPageLayout>
  );
}
