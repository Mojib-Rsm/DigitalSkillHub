
import HandwritingExtractorForm from "@/components/handwriting-extractor-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Edit } from "lucide-react";

export default function HandwritingExtractorPage() {
  return (
    <ToolPageLayout
        title="হাতের লেখা এক্সট্র্যাক্টর"
        description="আপনার হাতে লেখা ডকুমেন্টের একটি ছবি আপলোড করুন এবং সেটিকে সম্পাদনাযোগ্য টেক্সট, এক্সেল, ওয়ার্ড বা পিডিএফ-এ রূপান্তর করুন।"
        icon={<Edit className="w-12 h-12 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <HandwritingExtractorForm />
      </div>
    </ToolPageLayout>
  );
}
