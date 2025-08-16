
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
          জেনারেট করা হচ্ছে...
        </>
      ) : (
        <>
          <FileSignature className="mr-2 h-5 w-5" />
          কভার লেটার জেনারেট করুন
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
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.coverLetter) {
      navigator.clipboard.writeText(state.coverLetter);
      toast({
        title: "কপি করা হয়েছে!",
        description: "কভার লেটার ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>একটি কভার লেটার তৈরি করুন</CardTitle>
        <CardDescription>
          একটি ব্যক্তিগতকৃত, পেশাদার কভার লেটার পেতে নীচের বিবরণগুলি পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">পদের নাম</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="যেমন, সোশ্যাল মিডিয়া ম্যানেজার"
                defaultValue={state.fields?.jobTitle}
                required
              />
              {state.issues?.filter((issue) => issue.toLowerCase().includes("job")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">কোম্পানির নাম</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="যেমন, ডিজিটাল মার্কেটিং লিমিটেড"
                defaultValue={state.fields?.companyName}
                required
              />
              {state.issues?.filter((issue) => issue.toLowerCase().includes("company")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userSkills">আপনার প্রাসঙ্গিক দক্ষতা (কমা দ্বারা পৃথক)</Label>
            <Input
              id="userSkills"
              name="userSkills"
              placeholder="যেমন, কনটেন্ট তৈরি, ক্যানভা, ফেসবুক বিজ্ঞাপন"
              defaultValue={state.fields?.userSkills}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("skill")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userExperience">আপনার অভিজ্ঞতা সংক্ষেপে বর্ণনা করুন</Label>
            <Textarea
              id="userExperience"
              name="userExperience"
              placeholder="যেমন, ৩টি স্থানীয় ব্যবসার জন্য ফেসবুক পেজ পরিচালনা করেছি, তাদের ফলোয়ার গড়ে ২০% বাড়িয়েছি।"
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
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড কভার লেটার</h3>
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
