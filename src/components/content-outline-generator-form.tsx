
"use client";

import React, { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateContentOutlineAction } from "@/app/ai-tools/content-outline-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import type { ContentOutlineGeneratorOutput } from "@/ai/flows/content-outline-generator";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          আউটলাইন তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <List className="mr-2 h-5 w-5" />
          আউটলাইন তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function ContentOutlineGeneratorForm() {
  const [data, setData] = useState<ContentOutlineGeneratorOutput | undefined>(undefined);
  const [issues, setIssues] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setData(undefined);
    setIssues([]);
    const result = await generateContentOutlineAction(formData);
    if(result.success) {
        setData(result.data);
    } else {
        if (result.issues) {
            setIssues(result.issues);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unknown error occurred."
            });
        }
    }
    setIsSubmitting(false);
  }

  const getIssueMessage = (path: string) => {
      return issues.find(issue => issue.path.includes(path))?.message;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>কনটেন্ট আউটলাইন তৈরি করুন</CardTitle>
        <CardDescription>
          যেকোনো বিষয়ের জন্য একটি বিস্তারিত এবং সুগঠিত আউটলাইন তৈরি করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, কৃত্রিম বুদ্ধিমত্তার নৈতিকতা"
              required
            />
            {getIssueMessage('topic') && <p className="text-sm font-medium text-destructive">{getIssueMessage('topic')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contentType">কনটেন্টের ধরন</Label>
            <Input
              id="contentType"
              name="contentType"
              placeholder="যেমন, ব্লগ পোস্ট, ইউটিউব ভিডিও, প্রেজেন্টেশন"
              required
            />
             {getIssueMessage('contentType') && <p className="text-sm font-medium text-destructive">{getIssueMessage('contentType')}</p>}
          </div>
          
          <SubmitButton />
        </form>

        {isSubmitting && (
            <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার আউটলাইন তৈরি হচ্ছে...</p>
                </div>
            </div>
        )}

        {data?.outline && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold font-headline text-center">আপনার কনটেন্ট আউটলাইন</h3>
            <Accordion type="single" collapsible className="w-full">
                {data.outline.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-base font-semibold">{item.section}</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            {item.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
