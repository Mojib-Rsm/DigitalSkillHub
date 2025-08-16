
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { recommendCourses } from "@/app/ai-tools/course-recommender/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          সুপারিশ করা হচ্ছে...
        </>
      ) : (
        <>
          <GraduationCap className="mr-2 h-5 w-5" />
          কোর্স খুঁজুন
        </>
      )}
    </Button>
  );
}

export default function CourseRecommenderForm() {
  const initialState = { message: "", recommendations: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(recommendCourses, initialState);
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
        <CardTitle>কোর্স সুপারিশ পান</CardTitle>
        <CardDescription>
          আপনার আগ্রহ লিখুন এবং আমরা আপনার জন্য কিছু কোর্স সুপারিশ করব।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="interests">আপনার আগ্রহ বা কাঙ্ক্ষিত দক্ষতা</Label>
            <Input
              id="interests"
              name="interests"
              placeholder="যেমন, অনলাইনে কাপড় বিক্রি, গ্রাফিক ডিজাইন, বেসিক কম্পিউটার স্কিলস"
              defaultValue={state.fields?.interests}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("interest"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.recommendations && state.recommendations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">আমাদের সুপারিশ</h3>
            <div className="space-y-3">
              {state.recommendations.map((rec, index) => (
                <Card key={index} className="bg-background/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-accent"/>
                      {rec.courseName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground pl-9">{rec.reason}</p>
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
