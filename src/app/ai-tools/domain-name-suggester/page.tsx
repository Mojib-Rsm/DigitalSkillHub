
import DomainNameSuggesterForm from "@/components/domain-name-suggester-form";
import { Globe } from "lucide-react";

export default function DomainNameSuggesterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Globe className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">ডোমেইন নেম সাজেশনকারী</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার ব্যবসার জন্য নিখুঁত এবং উপলব্ধ ডোমেইন নাম খুঁজুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <DomainNameSuggesterForm />
      </div>
    </div>
  );
}
