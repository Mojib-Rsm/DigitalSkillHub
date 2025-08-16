
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getSuggestions } from "@/app/ai-tools/resume-helper/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-5 w-5" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export default function ResumeHelperForm() {
  const initialState = { message: "", suggestions: "", issues: [], fields: {} };
  const [state, formAction] = useFormState(getSuggestions, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      // Don't reset the form, user might want to tweak input
    }
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.suggestions) {
      navigator.clipboard.writeText(state.suggestions);
      toast({
        title: "Copied!",
        description: "Resume suggestions copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Improve Your Resume</CardTitle>
        <CardDescription>
          Enter your details and get AI-powered feedback to improve your resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Target Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="e.g., Junior Web Developer"
              defaultValue={state.fields?.jobTitle}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("job"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="skills">Your Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="e.g., HTML, CSS, JavaScript, React, Node.js"
              defaultValue={state.fields?.skills}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("skill"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="Paste your current work experience section here..."
              defaultValue={state.fields?.experience}
              required
              rows={8}
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("experience"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.suggestions && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">AI Suggestions</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.suggestions}</p>
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
