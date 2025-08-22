
import RefundPolicyGeneratorForm from "@/components/refund-policy-generator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Receipt } from "lucide-react";

export default function RefundPolicyGeneratorPage() {
  return (
    <ToolPageLayout
        title="রিফান্ড পলিসি জেনারেটর"
        description="আপনার ব্যবসার জন্য একটি স্পষ্ট এবং ন্যায্য রিফান্ড পলিসি তৈরি করুন।"
        icon={<Receipt className="w-12 h-12 text-primary" />}
    >
      <RefundPolicyGeneratorForm />
    </ToolPageLayout>
  );
}
