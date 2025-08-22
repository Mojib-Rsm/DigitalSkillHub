
import CourseRecommenderForm from "@/components/course-recommender-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { GraduationCap } from "lucide-react";

export default function CourseRecommenderPage() {
  return (
    <ToolPageLayout
        title="কোর্স রিকমেন্ডার"
        description="কোথায় শুরু করবেন নিশ্চিত নন? আপনার আগ্রহ আমাদের জানান, এবং আমরা আপনার জন্য সেরা কোর্সগুলো সুপারিশ করব।"
        icon={<GraduationCap className="w-12 h-12 text-primary" />}
    >
      <CourseRecommenderForm />
    </ToolPageLayout>
  );
}
