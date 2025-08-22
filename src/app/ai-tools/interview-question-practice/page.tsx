
import InterviewQuestionPracticeForm from "@/components/interview-question-practice-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { Briefcase } from "lucide-react";
import { notFound } from "next/navigation";

export default async function InterviewQuestionPracticePage() {
  const tool = await getToolByHref('/ai-tools/interview-question-practice');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<Briefcase className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <InterviewQuestionPracticeForm />
    </ToolPageLayout>
  );
}
