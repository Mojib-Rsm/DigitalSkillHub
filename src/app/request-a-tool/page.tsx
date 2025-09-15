

import { Lightbulb } from "lucide-react";
import RequestToolForm from "@/components/request-tool-form";

export default function RequestToolPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Lightbulb className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Request a New Tool</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Have an idea for a new AI tool that would make your life easier? Let us know! We are always looking for new ideas to build.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <RequestToolForm />
      </div>
    </div>
  );
}
