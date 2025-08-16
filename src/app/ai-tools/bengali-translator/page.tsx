
import BengaliTranslatorForm from "@/components/bengali-translator-form";
import { Languages } from "lucide-react";

export default function BengaliTranslatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Languages className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">বাংলা কনটেন্ট অনুবাদক</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার কনটেন্টের জন্য সহজেই ইংরেজি এবং বাংলার মধ্যে টেক্সট অনুবাদ করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <BengaliTranslatorForm />
      </div>
    </div>
  );
}
