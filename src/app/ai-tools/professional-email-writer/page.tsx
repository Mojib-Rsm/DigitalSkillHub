
import ProfessionalEmailWriterForm from "@/components/professional-email-writer-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Mail } from "lucide-react";

export default function ProfessionalEmailWriterPage() {
  return (
    <ToolPageLayout
        title="পেশাদার ইমেল লেখক"
        description="তাত্ক্ষণিকভাবে পরিষ্কার, সংক্ষিপ্ত এবং পেশাদার ইমেল ড্রাফ্ট করুন।"
        icon={<Mail className="w-12 h-12 text-primary" />}
    >
      <ProfessionalEmailWriterForm />
    </ToolPageLayout>
  );
}
