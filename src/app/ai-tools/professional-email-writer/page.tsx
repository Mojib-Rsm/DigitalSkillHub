
import ProfessionalEmailWriterForm from "@/components/professional-email-writer-form";
import { Mail } from "lucide-react";

export default function ProfessionalEmailWriterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Mail className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">পেশাদার ইমেল লেখক</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          তাত্ক্ষণিকভাবে পরিষ্কার, সংক্ষিপ্ত এবং পেশাদার ইমেল ড্রাফ্ট করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProfessionalEmailWriterForm />
      </div>
    </div>
  );
}
