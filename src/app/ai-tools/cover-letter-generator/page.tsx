
import CoverLetterGeneratorForm from "@/components/cover-letter-generator-form";
import { FileSignature } from "lucide-react";

export default function CoverLetterGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <FileSignature className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">কভার লেটার জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার কাঙ্ক্ষিত চাকরির জন্য একটি পেশাদার কভার লেটার তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <CoverLetterGeneratorForm />
      </div>
    </div>
  );
}
