
import InterviewQuestionPracticeForm from "@/components/interview-question-practice-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Briefcase } from "lucide-react";

export default function InterviewQuestionPracticePage() {
  return (
    <ToolPageLayout
        title="ইন্টারভিউ প্রশ্ন অনুশীলন"
        description="এআই-জেনারেটেড প্রশ্নগুলির সাথে অনুশীলন করে আপনার পরবর্তী চাকরির ইন্টারভিউর জন্য প্রস্তুতি নিন।"
        icon={<Briefcase className="w-12 h-12 text-primary" />}
    >
      <InterviewQuestionPracticeForm />
    </ToolPageLayout>
  );
}
