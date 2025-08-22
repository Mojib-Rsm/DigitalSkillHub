
import DomainNameSuggesterForm from "@/components/domain-name-suggester-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { Globe } from "lucide-react";

export default function DomainNameSuggesterPage() {
  return (
    <ToolPageLayout
        title="ডোমেইন নেম সাজেশনকারী"
        description="আপনার ব্যবসার জন্য নিখুঁত এবং উপলব্ধ ডোমেইন নাম খুঁজুন।"
        icon={<Globe className="w-12 h-12 text-primary" />}
    >
      <DomainNameSuggesterForm />
    </ToolPageLayout>
  );
}
