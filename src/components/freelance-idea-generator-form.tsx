
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateIdeas } from "@/app/ai-tools/freelance-idea-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Wand } from "lucide-react";
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
          <Wand className="mr-2 h-5 w-5" />
          আইডিয়া জেনারেট করুন
        </>
      )}
    </Button>
  );
}

export default function FreelanceIdeaGeneratorForm() {
  const initialState = { message: "", ideas: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateIdeas, initialState);
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>ফ্রিল্যান্স প্রকল্পের আইডিয়া পান</CardTitle>
        <CardDescription>
          আপনার দক্ষতা লিখুন এবং আমরা আপনার জন্য কিছু পরিষেবা সুপারিশ করব।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skills">আপনার দক্ষতা (কমা দ্বারা পৃথক)</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="যেমন, গ্রাফিক ডিজাইন, ক্যানভা, ভিডিও এডিটিং, কনটেন্ট লেখা"
              defaultValue={state.fields?.skills}
              required
            />
            {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.ideas && state.ideas.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">এখানে কিছু ধারণা দেওয়া হলো...</h3>
            <div className="space-y-3">
              {state.ideas.map((idea, index) => (
                <Card key={index} className="bg-background/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-3">
                      <Wand className="w-6 h-6 text-accent"/>
                      {idea.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground pl-9">{idea.description}</p>
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
