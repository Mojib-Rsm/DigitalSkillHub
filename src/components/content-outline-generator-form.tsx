
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateContentOutline } from "@/app/ai-tools/content-outline-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

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
  const initialState = { message: "", outline: undefined, issues: [], fields: {} };
  const [state, formAction] = useActionState(generateContentOutline, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
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
        <CardTitle>কনটেন্ট আউটলাইন তৈরি করুন</CardTitle>
        <CardDescription>
          যেকোনো বিষয়ের জন্য একটি বিস্তারিত এবং সুগঠিত আউটলাইন তৈরি করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, কৃত্রিম বুদ্ধিমত্তার নৈতিকতা"
              defaultValue={state.fields?.topic}
              required
            />
            {state.issues?.filter(i => i.includes("topic")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contentType">কনটেন্টের ধরন</Label>
            <Input
              id="contentType"
              name="contentType"
              placeholder="যেমন, ব্লগ পোস্ট, ইউটিউব ভিডিও, প্রেজেন্টেশন"
              defaultValue={state.fields?.contentType}
              required
            />
             {state.issues?.filter(i => i.includes("content type")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <SubmitButton />
        </form>

        {state.outline && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold font-headline text-center">আপনার কনটেন্ট আউটলাইন</h3>
            <Accordion type="single" collapsible className="w-full">
                {state.outline.map((item, index) => (
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
