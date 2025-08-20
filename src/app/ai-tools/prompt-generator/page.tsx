
import PromptGeneratorForm from "@/components/prompt-generator-form";
import { Sparkles } from "lucide-react";

export default function PromptGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Sparkles className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">এআই প্রম্পট জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার ধারণা দিন এবং ছবি, ভিডিও বা অডিওর জন্য একটি বিস্তারিত প্রম্পট তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PromptGeneratorForm />
      </div>
    </div>
  );
}
