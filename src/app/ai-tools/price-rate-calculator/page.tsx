
import PriceRateCalculatorForm from "@/components/price-rate-calculator-form";
import { DollarSign } from "lucide-react";

export default function PriceRateCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <DollarSign className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">মূল্য/রেট ক্যালকুলেটর</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার ফ্রিল্যান্স প্রকল্পের জন্য কত চার্জ করবেন তার জন্য একটি এআই-চালিত পরামর্শ পান।
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PriceRateCalculatorForm />
      </div>
    </div>
  );
}
