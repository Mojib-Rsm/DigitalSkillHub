
import InterviewQuestionPracticeForm from "@/components/interview-question-practice-form";
import { Briefcase } from "lucide-react";

export default function InterviewQuestionPracticePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Briefcase className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Interview Question Practice</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Prepare for your next job interview by practicing with AI-generated questions.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <InterviewQuestionPracticeForm />
      </div>
    </div>
  );
}

