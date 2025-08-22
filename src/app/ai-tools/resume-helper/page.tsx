
import ResumeHelperForm from "@/components/resume-helper-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { FileText } from "lucide-react";

export default function ResumeHelperPage() {
  return (
    <ToolPageLayout
        title="জীবনবৃত্তান্ত/সিভি সহায়ক"
        description="আপনার জীবনবৃত্তান্তকে আলাদা করে তোলার জন্য এআই-চালিত পরামর্শ পান।"
        icon={<FileText className="w-12 h-12 text-primary" />}
    >
      <ResumeHelperForm />
    </ToolPageLayout>
  );
}
