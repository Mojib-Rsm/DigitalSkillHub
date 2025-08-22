
import PriceRateCalculatorForm from "@/components/price-rate-calculator-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { DollarSign } from "lucide-react";

export default function PriceRateCalculatorPage() {
  return (
    <ToolPageLayout
        title="মূল্য/রেট ক্যালকুলেটর"
        description="আপনার ফ্রিল্যান্স প্রকল্পের জন্য কত চার্জ করবেন তার জন্য একটি এআই-চালিত পরামর্শ পান।"
        icon={<DollarSign className="w-12 h-12 text-primary" />}
    >
      <PriceRateCalculatorForm />
    </ToolPageLayout>
  );
}
