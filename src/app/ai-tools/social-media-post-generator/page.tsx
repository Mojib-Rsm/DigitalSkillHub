
import SocialMediaPostGeneratorForm from "@/components/social-media-post-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Hash } from "lucide-react";

export default function SocialMediaPostGeneratorPage() {
  return (
    <ToolPageLayout
        title="সোশ্যাল মিডিয়া পোস্ট জেনারেটর"
        description="কয়েক সেকেন্ডের মধ্যে আপনার সোশ্যাল মিডিয়া চ্যানেলগুলির জন্য আকর্ষণীয় পোস্ট তৈরি করুন।"
        icon={<Hash className="w-12 h-12 text-primary" />}
    >
      <SocialMediaPostGeneratorForm />
    </ToolPageLayout>
  );
}
