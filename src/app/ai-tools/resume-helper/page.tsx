
import ResumeHelperForm from "@/components/resume-helper-form";
import { FileText } from "lucide-react";

export default function ResumeHelperPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <FileText className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">জীবনবৃত্তান্ত/সিভি সহায়ক</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার জীবনবৃত্তান্তকে আলাদা করে তোলার জন্য এআই-চালিত পরামর্শ পান।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ResumeHelperForm />
      </div>
    </div>
  );
}
