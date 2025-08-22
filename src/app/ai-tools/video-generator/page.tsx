
import { Film } from "lucide-react";
import VideoGeneratorForm from "@/components/video-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";

export default function VideoGeneratorPage() {
  return (
    <ToolPageLayout
        title="এআই ভিডিও জেনারেটর"
        description="একটি সাধারণ টেক্সট প্রম্পট দিয়ে আপনার কল্পনার যেকোনো ভিডিও তৈরি করুন।"
        icon={<Film className="w-12 h-12 text-primary" />}
    >
      <VideoGeneratorForm />
    </ToolPageLayout>
  );
}
