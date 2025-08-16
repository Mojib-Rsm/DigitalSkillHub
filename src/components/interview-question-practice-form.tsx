
"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateQuestions } from "@/app/ai-tools/interview-question-practice/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Briefcase, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          জেনারেট করা হচ্ছে...
        </>
      ) : (
        <>
          <Briefcase className="mr-2 h-5 w-5" />
          প্রশ্ন জেনারেট করুন
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
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার ইন্টারভিউর জন্য অনুশীলন করুন</CardTitle>
        <CardDescription>
          আপনার লক্ষ্য ভূমিকার জন্য সাধারণ ইন্টারভিউ প্রশ্নগুলির একটি তালিকা পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">পদের নাম</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="যেমন, কাস্টমার সার্ভিস প্রতিনিধি"
              defaultValue={state.fields?.jobTitle}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("job"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">অভিজ্ঞতার স্তর</Label>
            <Select name="experienceLevel" defaultValue={state.fields?.experienceLevel}>
                <SelectTrigger id="experienceLevel">
                    <SelectValue placeholder="স্তর নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Entry-Level">এন্ট্রি-লেভেল</SelectItem>
                    <SelectItem value="Mid-Level">মধ্য-স্তর</SelectItem>
                    <SelectItem value="Senior">সিনিয়র</SelectItem>
                    <SelectItem value="Manager">ম্যানেজার</SelectItem>
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
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">অনুশীলন প্রশ্ন</h3>
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
