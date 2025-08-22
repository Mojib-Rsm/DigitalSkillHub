
import CoverLetterGeneratorForm from "@/components/cover-letter-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { FileSignature } from "lucide-react";

export default function CoverLetterGeneratorPage() {
  return (
    <ToolPageLayout
        title="কভার লেটার জেনারেটর"
        description="আপনার কাঙ্ক্ষিত চাকরির জন্য একটি পেশাদার কভার লেটার তৈরি করুন।"
        icon={<FileSignature className="w-12 h-12 text-primary" />}
    >
      <CoverLetterGeneratorForm />
    </ToolPageLayout>
  );
}
