
import BusinessNameGeneratorForm from "@/components/business-name-generator-form";
import { Lightbulb } from "lucide-react";

export default function BusinessNameGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Lightbulb className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Business Name Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect name for your new venture with a little help from AI.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <BusinessNameGeneratorForm />
      </div>
    </div>
  );
}
