
import FacebookReplyGeneratorForm from "@/components/facebook-reply-generator-form";
import { CornerDownRight } from "lucide-react";

export default function FacebookReplyGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <CornerDownRight className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">ফেসবুক রিপ্লাই জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          যেকোনো ফেসবুক কমেন্টের জন্য দ্রুত এবং বুদ্ধিদীপ্ত রিপ্লাই তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <FacebookReplyGeneratorForm />
      </div>
    </div>
  );
}
