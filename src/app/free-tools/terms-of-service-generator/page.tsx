
import TermsOfServiceGeneratorForm from "@/components/terms-of-service-generator-form";
import { FileText } from "lucide-react";

export default function TermsOfServiceGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <FileText className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Terms of Service Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Generate comprehensive terms of service for your website or app.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <TermsOfServiceGeneratorForm />
      </div>
    </div>
  );
}
