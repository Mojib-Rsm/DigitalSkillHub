
"use client";

import FacebookCommentGeneratorForm from "@/components/facebook-comment-generator-form";
import { MessageSquare } from "lucide-react";

export default function FacebookCommentGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <MessageSquare className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">ফেসবুক কমেন্ট জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          যেকোনো ফেসবুক পোস্টের জন্য দ্রুত এবং প্রাসঙ্গিক কমেন্ট এবং রিপ্লাই তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <FacebookCommentGeneratorForm />
      </div>
    </div>
  );
}
