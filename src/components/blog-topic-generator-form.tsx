
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateTopics } from "@/app/ai-tools/blog-topic-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Lightbulb } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Topics
        </>
      )}
    </Button>
  );
}

export default function BlogTopicGeneratorForm() {
  const initialState = { message: "", topics: [], issues: [], fields: {} };
  const [state, formAction] = useFormState(generateTopics, initialState);
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
        <CardTitle>Generate Your Next Idea</CardTitle>
        <CardDescription>
          Provide some keywords and let our AI do the creative work.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="digitalSkills">Trending Digital Skills</Label>
            <Input
              id="digitalSkills"
              name="digitalSkills"
              placeholder="e.g., Web Development, SEO, AI Tools"
              defaultValue={state.fields?.digitalSkills}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("skill"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userInterests">Your Interests</Label>
            <Textarea
              id="userInterests"
              name="userInterests"
              placeholder="e.g., Python, Freelancing, Side Hustles"
              defaultValue={state.fields?.userInterests}
              required
            />
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("interest"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.topics && state.topics.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Topics</h3>
            <div className="space-y-3">
              {state.topics.map((topic, index) => (
                <Card key={index} className="bg-background/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Lightbulb className="w-6 h-6 text-accent"/>
                    <p className="font-medium flex-1">{topic}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
