
import RefundPolicyGeneratorForm from "@/components/refund-policy-generator-form";
import { Receipt } from "lucide-react";

export default function RefundPolicyGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Receipt className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">রিফান্ড পলিসি জেনারেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার ব্যবসার জন্য একটি স্পষ্ট এবং ন্যায্য রিফান্ড পলিসি তৈরি করুন।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <RefundPolicyGeneratorForm />
      </div>
    </div>
  );
}
