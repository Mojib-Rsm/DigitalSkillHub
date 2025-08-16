
import BlogTopicGeneratorForm from "@/components/blog-topic-generator-form";
import { PenSquare } from "lucide-react";

export default function BlogTopicGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <PenSquare className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">ব্লগ টপিক জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          কি লিখবেন তা নিয়ে ভাবছেন? ট্রেন্ডিং দক্ষতার এবং আপনার আগ্রহের উপর ভিত্তি করে প্রাসঙ্গিক ব্লগ বিষয়ের ধারণা তৈরি করতে আমাদের এআই টুল ব্যবহার করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <BlogTopicGeneratorForm />
      </div>
    </div>
  );
}
