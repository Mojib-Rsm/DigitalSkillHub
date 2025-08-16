
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateCoverLetter } from "@/app/ai-tools/cover-letter-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, FileSignature } from "lucide-react";
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
          <FileSignature className="mr-2 h-5 w-5" />
          Generate Cover Letter
        </>
      )}
    </Button>
  );
}

export default function CoverLetterGeneratorForm() {
  const initialState = { message: "", coverLetter: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateCoverLetter, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      // Do not reset the form, user may want to tweak inputs.
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
    if (state.coverLetter) {
      navigator.clipboard.writeText(state.coverLetter);
      toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Generate a Cover Letter</CardTitle>
        <CardDescription>
          Fill in the details below to get a personalized, professional cover letter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="e.g., Social Media Manager"
                defaultValue={state.fields?.jobTitle}
                required
              />
              {state.issues?.filter((issue) => issue.toLowerCase().includes("job")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="e.g., Digital Marketing Ltd."
                defaultValue={state.fields?.companyName}
                required
              />
              {state.issues?.filter((issue) => issue.toLowerCase().includes("company")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userSkills">Your Relevant Skills (comma-separated)</Label>
            <Input
              id="userSkills"
              name="userSkills"
              placeholder="e.g., Content Creation, Canva, Facebook Ads"
              defaultValue={state.fields?.userSkills}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("skill")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userExperience">Briefly Describe Your Experience</Label>
            <Textarea
              id="userExperience"
              name="userExperience"
              placeholder="e.g., Managed Facebook pages for 3 local businesses, growing their following by 20% on average."
              defaultValue={state.fields?.userExperience}
              required
              rows={4}
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("experience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.coverLetter && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Cover Letter</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.coverLetter}</p>
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
