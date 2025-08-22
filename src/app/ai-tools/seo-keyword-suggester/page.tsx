
import SeoKeywordSuggesterForm from "@/components/seo-keyword-suggester-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { BarChart } from "lucide-react";

export default function SeoKeywordSuggesterPage() {
  return (
    <ToolPageLayout
        title="এসইও কীওয়ার্ড সাজেশনকারী"
        description="আপনার সার্চ ইঞ্জিন র‌্যাঙ্কিং বাড়াতে শক্তিশালী কীওয়ার্ড আবিষ্কার করুন।"
        icon={<BarChart className="w-12 h-12 text-primary" />}
    >
      <SeoKeywordSuggesterForm />
    </ToolPageLayout>
  );
}
