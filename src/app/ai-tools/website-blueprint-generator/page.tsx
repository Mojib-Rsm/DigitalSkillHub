
import WebsiteBlueprintGeneratorForm from "@/components/website-blueprint-generator-form";
import { LayoutTemplate } from "lucide-react";

export default function WebsiteBlueprintGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <LayoutTemplate className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">ওয়েবসাইট ব্লুপ্রিন্ট জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার ওয়েবসাইটের ধারণাটি দিন এবং এআই আপনার জন্য একটি সম্পূর্ণ পরিকল্পনা তৈরি করবে।
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <WebsiteBlueprintGeneratorForm />
      </div>
    </div>
  );
}
