
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateQuestions } from "@/app/ai-tools/interview-question-practice/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Briefcase, HelpCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
          <Briefcase className="mr-2 h-5 w-5" />
          Generate Questions
        </>
      )}
    </Button>
  );
}

export default function InterviewQuestionPracticeForm() {
  const initialState = { message: "", questions: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateQuestions, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      // Don't reset form, user might want to generate more
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
        <CardTitle>Practice for Your Interview</CardTitle>
        <CardDescription>
          Get a list of common interview questions for your target role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="e.g., Customer Service Representative"
              defaultValue={state.fields?.jobTitle}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("job"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select name="experienceLevel" defaultValue={state.fields?.experienceLevel}>
                <SelectTrigger id="experienceLevel">
                    <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                    <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
            </Select>
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("experience"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.questions && state.questions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Practice Questions</h3>
            <div className="space-y-3">
              {state.questions.map((question, index) => (
                <Card key={index} className="bg-background/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <HelpCircle className="w-6 h-6 text-accent"/>
                    <p className="font-medium flex-1">{question}</p>
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
