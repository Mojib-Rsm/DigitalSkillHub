
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { suggestKeywords } from "@/app/ai-tools/seo-keyword-suggester/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, BarChart, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Suggesting...
        </>
      ) : (
        <>
          <BarChart className="mr-2 h-5 w-5" />
          Suggest Keywords
        </>
      )}
    </Button>
  );
}

export default function SeoKeywordSuggesterForm() {
  const initialState = { message: "", keywords: [], issues: [], fields: {} };
  const [state, formAction] = useFormState(suggestKeywords, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
    }
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Find SEO Keywords</CardTitle>
        <CardDescription>
          Enter your topic and target audience to get a list of SEO-friendly keywords.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic / Niche</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g., Handmade soap in Bangladesh"
              defaultValue={state.fields?.topic}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("topic"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="e.g., Eco-conscious women in Dhaka"
              defaultValue={state.fields?.targetAudience}
              required
            />
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("audience"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.keywords && state.keywords.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Suggested Keywords</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {state.keywords.map((keyword, index) => (
                <div key={index} className="bg-muted text-muted-foreground rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    {keyword}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
