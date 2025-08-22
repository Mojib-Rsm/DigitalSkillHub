
import BusinessNameGeneratorForm from "@/components/business-name-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Lightbulb } from "lucide-react";

export default function BusinessNameGeneratorPage() {
  return (
     <ToolPageLayout
        title="ব্যবসার নাম জেনারেটর"
        description="এআই এর সাহায্যে আপনার নতুন উদ্যোগের জন্য সেরা নামটি খুঁজুন।"
        icon={<Lightbulb className="w-12 h-12 text-primary" />}
    >
      <BusinessNameGeneratorForm />
    </ToolPageLayout>
  );
}
