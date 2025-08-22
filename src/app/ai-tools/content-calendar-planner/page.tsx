
import ContentCalendarPlannerForm from "@/components/content-calendar-planner-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { getRelatedTools, getToolByHref } from "@/services/tool-service";
import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ContentCalendarPlannerPage() {
  const tool = await getToolByHref('/ai-tools/content-calendar-planner');
  if (!tool) notFound();

  const relatedTools = await getRelatedTools(tool.category, tool.id);

  return (
    <ToolPageLayout
        title={tool.title}
        description={tool.description}
        icon={<CalendarDays className="w-12 h-12 text-primary" />}
        relatedTools={relatedTools}
    >
      <ContentCalendarPlannerForm />
    </ToolPageLayout>
  );
}
