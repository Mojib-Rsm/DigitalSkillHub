
import WebsiteBlueprintGeneratorForm from "@/components/website-blueprint-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { LayoutTemplate } from "lucide-react";

export default function WebsiteBlueprintGeneratorPage() {
  return (
    <ToolPageLayout
        title="ওয়েবসাইট ব্লুপ্রিন্ট জেনারেটর"
        description="আপনার ওয়েবসাইটের ধারণাটি দিন এবং এআই আপনার জন্য একটি সম্পূর্ণ পরিকল্পনা তৈরি করবে।"
        icon={<LayoutTemplate className="w-12 h-12 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <WebsiteBlueprintGeneratorForm />
      </div>
    </ToolPageLayout>
  );
}
