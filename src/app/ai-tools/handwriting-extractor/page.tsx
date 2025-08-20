
import HandwritingExtractorForm from "@/components/handwriting-extractor-form";
import { Edit } from "lucide-react";

export default function HandwritingExtractorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Edit className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">হাতের লেখা এক্সট্র্যাক্টর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার হাতে লেখা নোট বা ডকুমেন্টের একটি ছবি আপলোড করুন এবং সেটিকে সম্পাদনাযোগ্য টেক্সট, এক্সেল, ওয়ার্ড বা পিডিএফ-এ রূপান্তর করুন।
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <HandwritingExtractorForm />
      </div>
    </div>
  );
}
