
import FacebookCommentGeneratorForm from "@/components/facebook-comment-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { MessageSquare } from "lucide-react";

export default function FacebookCommentGeneratorPage() {
  return (
    <ToolPageLayout
        title="ফেসবুক কমেন্ট জেনারেটর"
        description="যেকোনো ফেসবুক পোস্টের জন্য দ্রুত এবং প্রাসঙ্গিক কমেন্ট এবং রিপ্লাই তৈরি করুন।"
        icon={<MessageSquare className="w-12 h-12 text-primary" />}
    >
      <FacebookCommentGeneratorForm />
    </ToolPageLayout>
  );
}
