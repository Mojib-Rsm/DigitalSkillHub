
import PromptGeneratorForm from "@/components/prompt-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Sparkles } from "lucide-react";

export default function PromptGeneratorPage() {
  return (
    <ToolPageLayout
        title="এআই প্রম্পট জেনারেটর"
        description="আপনার ধারণা দিন এবং ছবি, ভিডিও বা অডিওর জন্য একটি বিস্তারিত প্রম্পট তৈরি করুন।"
        icon={<Sparkles className="w-12 h-12 text-primary" />}
    >
      <PromptGeneratorForm />
    </ToolPageLayout>
  );
}
