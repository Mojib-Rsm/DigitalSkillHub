
import NoteSummarizerForm from "@/components/note-summarizer-form";
import { BookCheck } from "lucide-react";

export default function NoteSummarizerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <BookCheck className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">নোট সারাংশকারী</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          দীর্ঘ নিবন্ধ বা নথিগুলিকে সংক্ষিপ্ত, সহজে হজমযোগ্য নোটগুলিতে পরিণত করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <NoteSummarizerForm />
      </div>
    </div>
  );
}
