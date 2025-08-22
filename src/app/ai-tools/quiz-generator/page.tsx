
import QuizGeneratorForm from "@/components/quiz-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { HelpCircle } from "lucide-react";

export default function QuizGeneratorPage() {
  return (
    <ToolPageLayout
        title="কুইজ জেনারেটর"
        description="যেকোনো পাঠ্য পেস্ট করুন এবং আপনার বোধগম্যতা পরীক্ষা করার জন্য তাত্ক্ষণিকভাবে একটি কুইজ তৈরি করুন।"
        icon={<HelpCircle className="w-12 h-12 text-primary" />}
    >
      <QuizGeneratorForm />
    </ToolPageLayout>
  );
}
