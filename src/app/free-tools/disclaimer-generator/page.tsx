
import DisclaimerGeneratorForm from "@/components/disclaimer-generator-form";
import { GanttChartSquare } from "lucide-react";

export default function DisclaimerGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <GanttChartSquare className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Disclaimer Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Create professional disclaimers to protect your business with industry-specific templates.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <DisclaimerGeneratorForm />
      </div>
    </div>
  );
}
