
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { calculatePrice } from "@/app/ai-tools/price-rate-calculator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          হিসাব করা হচ্ছে...
        </>
      ) : (
        <>
          <DollarSign className="mr-2 h-5 w-5" />
          মূল্য হিসাব করুন
        </>
      )}
    </Button>
  );
}

export default function PriceRateCalculatorForm() {
  const initialState = { message: "", priceRange: "", justification: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(calculatePrice, initialState);
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার প্রকল্পের হার গণনা করুন</CardTitle>
        <CardDescription>
          আপনার কাজের জন্য একটি প্রস্তাবিত মূল্য পরিসীমা পেতে কয়েকটি প্রশ্নের উত্তর দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectType">প্রকল্পের ধরন</Label>
            <Input
              id="projectType"
              name="projectType"
              placeholder="যেমন, ৫-পৃষ্ঠার ওয়েবসাইট ডিজাইন, ১০০০-শব্দের ব্লগ পোস্ট"
              defaultValue={state.fields?.projectType}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("project")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complexity">জটিলতা</Label>
              <Select name="complexity" defaultValue={state.fields?.complexity}>
                <SelectTrigger id="complexity">
                  <SelectValue placeholder="জটিলতা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">কম</SelectItem>
                  <SelectItem value="Medium">মাঝারি</SelectItem>
                  <SelectItem value="High">উচ্চ</SelectItem>
                </SelectContent>
              </Select>
              {state.issues?.filter((issue) => issue.toLowerCase().includes("complexity")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">আপনার অভিজ্ঞতার স্তর</Label>
              <Select name="experienceLevel" defaultValue={state.fields?.experienceLevel}>
                <SelectTrigger id="experienceLevel">
                  <SelectValue placeholder="অভিজ্ঞতার স্তর নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">শিক্ষানবিশ</SelectItem>
                  <SelectItem value="Intermediate">মধ্যবর্তী</SelectItem>
                  <SelectItem value="Expert">বিশেষজ্ঞ</SelectItem>
                </SelectContent>
              </Select>
              {state.issues?.filter((issue) => issue.toLowerCase().includes("experience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          
          <SubmitButton />
        </form>

        {state.priceRange && state.justification && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">প্রস্তাবিত মূল্য</h3>
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertTitle className="text-2xl font-bold text-primary">{state.priceRange}</AlertTitle>
              <AlertDescription className="mt-2">
                {state.justification}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
