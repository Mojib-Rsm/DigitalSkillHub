
import NoteSummarizerForm from "@/components/note-summarizer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { BookCheck } from "lucide-react";

export default function NoteSummarizerPage() {
  return (
    <ToolPageLayout
        title="নোট সারাংশকারী"
        description="দীর্ঘ নিবন্ধ বা নথিগুলিকে সংক্ষিপ্ত, সহজে হজমযোগ্য নোটগুলিতে পরিণত করুন।"
        icon={<BookCheck className="w-12 h-12 text-primary" />}
    >
      <NoteSummarizerForm />
    </ToolPageLayout>
  );
}
