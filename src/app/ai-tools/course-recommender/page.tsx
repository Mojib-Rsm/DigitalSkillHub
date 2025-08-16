
import CourseRecommenderForm from "@/components/course-recommender-form";
import { GraduationCap } from "lucide-react";

export default function CourseRecommenderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <GraduationCap className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">কোর্স রিকমেন্ডার</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          কোথায় শুরু করবেন নিশ্চিত নন? আপনার আগ্রহ আমাদের জানান, এবং আমরা আপনার জন্য সেরা কোর্সগুলো সুপারিশ করব।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <CourseRecommenderForm />
      </div>
    </div>
  );
}
