
import BengaliTranslatorForm from "@/components/bengali-translator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Languages } from "lucide-react";

export default function BengaliTranslatorPage() {
  return (
    <ToolPageLayout
        title="বাংলা কনটেন্ট অনুবাদক"
        description="আপনার কনটেন্টের জন্য সহজেই ইংরেজি এবং বাংলার মধ্যে টেক্সট অনুবাদ করুন।"
        icon={<Languages className="w-12 h-12 text-primary" />}
    >
        <BengaliTranslatorForm />
    </ToolPageLayout>
  );
}
