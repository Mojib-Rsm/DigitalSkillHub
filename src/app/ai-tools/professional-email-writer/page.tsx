
import ProfessionalEmailWriterForm from "@/components/professional-email-writer-form";
import { Mail } from "lucide-react";

export default function ProfessionalEmailWriterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Mail className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Professional Email Writer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Draft clear, concise, and professional emails in an instant.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProfessionalEmailWriterForm />
      </div>
    </div>
  );
}
