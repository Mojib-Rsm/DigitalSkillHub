
import BlogTopicGeneratorForm from "@/components/blog-topic-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { PenSquare } from "lucide-react";

export default function BlogTopicGeneratorPage() {
  return (
    <ToolPageLayout
        title="ব্লগ টপিক জেনারেটর"
        description="কি লিখবেন তা নিয়ে ভাবছেন? ট্রেন্ডিং দক্ষতার এবং আপনার আগ্রহের উপর ভিত্তি করে প্রাসঙ্গিক ব্লগ বিষয়ের ধারণা তৈরি করতে আমাদের এআই টুল ব্যবহার করুন।"
        icon={<PenSquare className="w-12 h-12 text-primary" />}
    >
      <BlogTopicGeneratorForm />
    </ToolPageLayout>
  );
}
