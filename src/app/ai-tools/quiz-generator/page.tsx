
import QuizGeneratorForm from "@/components/quiz-generator-form";
import { HelpCircle } from "lucide-react";

export default function QuizGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <HelpCircle className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Quiz Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Paste any text and instantly generate a quiz to test your comprehension.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <QuizGeneratorForm />
      </div>
    </div>
  );
}
