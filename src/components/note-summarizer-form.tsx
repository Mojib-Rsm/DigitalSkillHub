
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { summarizeText } from "@/app/ai-tools/note-summarizer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, BookCheck, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <BookCheck className="mr-2 h-5 w-5" />
          Summarize Text
        </>
      )}
    </Button>
  );
}

export default function NoteSummarizerForm() {
  const initialState = { message: "", summary: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(summarizeText, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);

  const handleCopy = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Summarize Your Notes</CardTitle>
        <CardDescription>
          Paste any text and choose your desired summary format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Text to Summarize</Label>
            <Textarea
              id="text"
              name="text"
              placeholder="Paste your text here..."
              defaultValue={state.fields?.text}
              required
              rows={10}
            />
            {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <div className="space-y-2">
            <Label>Summary Format</Label>
            <RadioGroup name="format" defaultValue="bullet_points" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bullet_points" id="bullet_points" />
                <Label htmlFor="bullet_points">Bullet Points</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paragraph" id="paragraph" />
                <Label htmlFor="paragraph">Paragraph</Label>
              </div>
            </RadioGroup>
          </div>

          <SubmitButton />
        </form>

        {state.summary && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Summary</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <div className="text-muted-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: state.summary.replace(/\n/g, '<br />') }} />
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
