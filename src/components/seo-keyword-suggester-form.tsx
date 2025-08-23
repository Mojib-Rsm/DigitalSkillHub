
"use client";

import React, { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { suggestKeywordsAction } from "@/app/ai-tools/seo-keyword-suggester/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, BarChart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SeoKeywordSuggesterOutput } from "@/ai/flows/seo-keyword-suggester";

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
          <BarChart className="mr-2 h-5 w-5" />
          কীওয়ার্ড সুপারিশ করুন
        </>
      )}
    </Button>
  );
}

export default function SeoKeywordSuggesterForm() {
  const [data, setData] = useState<SeoKeywordSuggesterOutput | undefined>(undefined);
  const [issues, setIssues] = useState<Record<string, string[]> | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
      setIsSubmitting(true);
      setData(undefined);
      setIssues(undefined);

      const result = await suggestKeywordsAction(formData);

      if (result.success) {
          setData(result.data);
          formRef.current?.reset();
      } else {
          if (result.issues) {
              setIssues(result.issues as any);
          } else {
            toast({
                variant: "destructive",
                title: "ত্রুটি",
                description: "An unknown error occurred.",
            })
          }
      }
      setIsSubmitting(false);
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>এসইও কীওয়ার্ড খুঁজুন</CardTitle>
        <CardDescription>
          এসইও-বান্ধব কীওয়ার্ডগুলির একটি তালিকা পেতে আপনার বিষয় এবং লক্ষ্য দর্শক লিখুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">বিষয় / বিশেষত্ব</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, বাংলাদেশে হাতে তৈরি সাবান"
              required
            />
            {issues?.topic && <p className="text-sm font-medium text-destructive">{issues.topic[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">লক্ষ্য দর্শক</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="যেমন, ঢাকার পরিবেশ-সচেতন নারী"
              required
            />
            {issues?.targetAudience && <p className="text-sm font-medium text-destructive">{issues.targetAudience[0]}</p>}
          </div>
          <SubmitButton />
        </form>

        {isSubmitting && (
            <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার কীওয়ার্ড খুঁজে বের করা হচ্ছে...</p>
                </div>
            </div>
        )}

        {data?.keywords && data.keywords.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">সুপারিশকৃত কীওয়ার্ড</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {data.keywords.map((keyword, index) => (
                <div key={index} className="bg-muted text-muted-foreground rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    {keyword}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
