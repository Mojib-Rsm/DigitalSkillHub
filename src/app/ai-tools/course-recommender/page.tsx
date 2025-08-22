
import CourseRecommenderForm from "@/components/course-recommender-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { GraduationCap } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CourseRecommenderPage() {
  const tool = await getToolByHref('/ai-tools/course-recommender');
  if (!tool) notFound();
  
  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<GraduationCap className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <CourseRecommenderForm />
    </ToolPageLayout>
  );
}
