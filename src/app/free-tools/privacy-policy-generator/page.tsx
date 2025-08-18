
import PrivacyPolicyGeneratorForm from "@/components/privacy-policy-generator-form";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Privacy Policy Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Create GDPR-compliant privacy policies for your website in minutes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PrivacyPolicyGeneratorForm />
      </div>
    </div>
  );
}
