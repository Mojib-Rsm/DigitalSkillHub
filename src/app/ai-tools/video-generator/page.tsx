
import { Film } from "lucide-react";
import VideoGeneratorForm from "@/components/video-generator-form";
import ToolAuthGuard from "@/components/tool-auth-guard";

export default function VideoGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Film className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">এআই ভিডিও জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          একটি সাধারণ টেক্সট প্রম্পট দিয়ে আপনার কল্পনার যেকোনো ভিডিও তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ToolAuthGuard>
            <VideoGeneratorForm />
        </ToolAuthGuard>
      </div>
    </div>
  );
}
