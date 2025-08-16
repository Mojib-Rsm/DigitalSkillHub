
import FreelanceIdeaGeneratorForm from "@/components/freelance-idea-generator-form";
import { Wand } from "lucide-react";

export default function FreelanceIdeaGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Wand className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Freelance Idea Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Turn your skills into services. Get inspired with project ideas you can offer to clients.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <FreelanceIdeaGeneratorForm />
      </div>
    </div>
  );
}
