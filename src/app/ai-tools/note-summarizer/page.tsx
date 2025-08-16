
import NoteSummarizerForm from "@/components/note-summarizer-form";
import { BookCheck } from "lucide-react";

export default function NoteSummarizerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <BookCheck className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Note Summarizer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Turn long articles or documents into concise, easy-to-digest notes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <NoteSummarizerForm />
      </div>
    </div>
  );
}
