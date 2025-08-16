
import QuizGeneratorForm from "@/components/quiz-generator-form";
import { HelpCircle } from "lucide-react";

export default function QuizGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <HelpCircle className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">কুইজ জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          যেকোনো পাঠ্য পেস্ট করুন এবং আপনার বোধগম্যতা পরীক্ষা করার জন্য তাত্ক্ষণিকভাবে একটি কুইজ তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <QuizGeneratorForm />
      </div>
    </div>
  );
}
