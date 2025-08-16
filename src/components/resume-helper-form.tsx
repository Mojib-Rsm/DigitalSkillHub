
"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { getSuggestions } from "@/app/ai-tools/resume-helper/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          বিশ্লেষণ করা হচ্ছে...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-5 w-5" />
          সুপারিশ পান
        </>
      )}
    </Button>
  );
}

export default function ResumeHelperForm() {
  const initialState = { message: "", suggestions: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(getSuggestions, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      // Don't reset the form, user might want to tweak input
    }
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.suggestions) {
      navigator.clipboard.writeText(state.suggestions);
      toast({
        title: "কপি করা হয়েছে!",
        description: "জীবনবৃত্তান্তের পরামর্শ ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার জীবনবৃত্তান্ত উন্নত করুন</CardTitle>
        <CardDescription>
          আপনার বিবরণ লিখুন এবং আপনার জীবনবৃত্তান্ত উন্নত করার জন্য এআই-চালিত প্রতিক্রিয়া পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">লক্ষ্য পদের নাম</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="যেমন, জুনিয়র ওয়েব ডেভেলপার"
              defaultValue={state.fields?.jobTitle}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("job"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="skills">আপনার দক্ষতা (কমা দ্বারা পৃথক)</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="যেমন, এইচটিএমএল, সিএসএস, জাভাস্ক্রিপ্ট, রিঅ্যাক্ট, নোড.জেএস"
              defaultValue={state.fields?.skills}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("skill"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">কাজের অভিজ্ঞতা</Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="আপনার বর্তমান কাজের অভিজ্ঞতা বিভাগটি এখানে পেস্ট করুন..."
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
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">এআই পরামর্শ</h3>
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
