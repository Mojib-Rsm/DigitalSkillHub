
import SeoKeywordSuggesterForm from "@/components/seo-keyword-suggester-form";
import { BarChart } from "lucide-react";

export default function SeoKeywordSuggesterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <BarChart className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">এসইও কীওয়ার্ড সাজেশনকারী</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার সার্চ ইঞ্জিন র‌্যাঙ্কিং বাড়াতে শক্তিশালী কীওয়ার্ড আবিষ্কার করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SeoKeywordSuggesterForm />
      </div>
    </div>
  );
}
