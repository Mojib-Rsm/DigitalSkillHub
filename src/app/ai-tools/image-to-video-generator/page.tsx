
import { Clapperboard } from "lucide-react";
import ImageToVideoGeneratorForm from "@/components/image-to-video-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";

export default function ImageToVideoGeneratorPage() {
  return (
    <ToolPageLayout
        title="ইমেজ টু ভিডিও জেনারেটর"
        description="একটি ছবি আপলোড করুন এবং প্রম্পট দিন, এআই আপনার জন্য ভিডিও তৈরি করবে।"
        icon={<Clapperboard className="w-12 h-12 text-primary" />}
    >
        <ImageToVideoGeneratorForm />
    </ToolPageLayout>
  );
}
