
import FreelanceIdeaGeneratorForm from "@/components/freelance-idea-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Wand } from "lucide-react";

export default function FreelanceIdeaGeneratorPage() {
  return (
    <ToolPageLayout
        title="ফ্রিল্যান্স আইডিয়া জেনারেটর"
        description="আপনার দক্ষতাকে সেবায় রূপান্তর করুন। ক্লায়েন্টদের কাছে অফার করার জন্য প্রকল্পের ধারণা থেকে অনুপ্রাণিত হন।"
        icon={<Wand className="w-12 h-12 text-primary" />}
    >
      <FreelanceIdeaGeneratorForm />
    </ToolPageLayout>
  );
}
