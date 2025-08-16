import BlogTopicGeneratorForm from "@/components/blog-topic-generator-form";
import { Bot } from "lucide-react";

export default function AiToolPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Bot className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Blog Topic Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Stuck on what to write? Use our AI tool to generate relevant blog topic ideas based on trending skills and your interests.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <BlogTopicGeneratorForm />
      </div>
    </div>
  );
}
