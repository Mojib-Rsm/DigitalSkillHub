
import ImageGeneratorForm from "@/components/image-generator-form";
import ToolAuthGuard from "@/components/tool-auth-guard";
import { Image } from "lucide-react";

export default function ImageGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Image className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">এআই ইমেজ জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          একটি সাধারণ টেক্সট প্রম্পট দিয়ে লোগো, ব্যানার বা আপনার কল্পনার যেকোনো ছবি তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ToolAuthGuard>
            <ImageGeneratorForm />
        </ToolAuthGuard>
      </div>
    </div>
  );
}
