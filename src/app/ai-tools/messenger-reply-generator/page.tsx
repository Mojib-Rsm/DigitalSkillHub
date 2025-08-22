
import MessengerReplyGeneratorForm from "@/components/messenger-reply-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { MessageCircle } from "lucide-react";

export default function MessengerReplyGeneratorPage() {
  return (
    <ToolPageLayout
        title="মেসেঞ্জার রিপ্লাই জেনারেটর"
        description="যেকোনো মেসেঞ্জার কথোপকথনের জন্য দ্রুত এবং বুদ্ধিদীপ্ত রিপ্লাই তৈরি করুন।"
        icon={<MessageCircle className="w-12 h-12 text-primary" />}
    >
      <MessengerReplyGeneratorForm />
    </ToolPageLayout>
  );
}
