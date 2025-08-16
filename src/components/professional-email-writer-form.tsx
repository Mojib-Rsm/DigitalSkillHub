
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { writeEmail } from "@/app/ai-tools/professional-email-writer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Mail } from "lucide-react";
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
          লেখা হচ্ছে...
        </>
      ) : (
        <>
          <Mail className="mr-2 h-5 w-5" />
          ইমেল লিখুন
        </>
      )}
    </Button>
  );
}

export default function ProfessionalEmailWriterForm() {
  const initialState = { message: "", emailDraft: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(writeEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
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
    if (state.emailDraft) {
      navigator.clipboard.writeText(state.emailDraft);
      toast({
        title: "কপি করা হয়েছে!",
        description: "ইমেল ড্রাফট ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>একটি পেশাদার ইমেল লিখুন</CardTitle>
        <CardDescription>
          আপনি কী বলতে চান তা এআইকে বলুন, এবং এটি আপনার জন্য ইমেলটি ড্রাফ্ট করবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recipient">প্রাপক</Label>
                    <Input
                    id="recipient"
                    name="recipient"
                    placeholder="যেমন, নিয়োগ ব্যবস্থাপক, সম্ভাব্য ক্লায়েন্ট"
                    defaultValue={state.fields?.recipient}
                    required
                    />
                    {state.issues
                    ?.filter((issue) => issue.toLowerCase().includes("recipient"))
                    .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tone">ধরণ</Label>
                    <Select name="tone" defaultValue={state.fields?.tone}>
                        <SelectTrigger id="tone">
                            <SelectValue placeholder="ধরণ নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Formal">ফরমাল</SelectItem>
                            <SelectItem value="Friendly">বন্ধুসুলভ</SelectItem>
                            <SelectItem value="Persuasive">প্ররোচনামূলক</SelectItem>
                            <SelectItem value="Appreciative">প্রশংসাসূচক</SelectItem>
                        </SelectContent>
                    </Select>
                    {state.issues
                    ?.filter((issue) => issue.toLowerCase().includes("tone"))
                    .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">ইমেলের উদ্দেশ্য</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="যেমন, একটি চাকরির আবেদনের ফলোআপ, একটি অংশীদারিত্ব সম্পর্কে জিজ্ঞাসা, একজন ক্লায়েন্টকে তার ব্যবসার জন্য ধন্যবাদ।"
              defaultValue={state.fields?.purpose}
              required
              rows={4}
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("purpose"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.emailDraft && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড ইমেল ড্রাফ্ট</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.emailDraft}</p>
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
