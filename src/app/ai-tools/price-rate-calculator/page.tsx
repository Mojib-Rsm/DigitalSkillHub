
import PriceRateCalculatorForm from "@/components/price-rate-calculator-form";
import { DollarSign } from "lucide-react";

export default function PriceRateCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <DollarSign className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Price/Rate Calculator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Get an AI-powered suggestion for how much to charge for your freelance projects.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PriceRateCalculatorForm />
      </div>
    </div>
  );
}
