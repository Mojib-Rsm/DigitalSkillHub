
import ImageGeneratorForm from "@/components/image-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Image } from "lucide-react";

export default function ImageGeneratorPage() {
  return (
    <ToolPageLayout
        title="এআই ইমেজ জেনারেটর"
        description="একটি সাধারণ টেক্সট প্রম্পট দিয়ে লোগো, ব্যানার বা আপনার কল্পনার যেকোনো ছবি তৈরি করুন।"
        icon={<Image className="w-12 h-12 text-primary" />}
    >
      <ImageGeneratorForm />
    </ToolPageLayout>
  );
}
