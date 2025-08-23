
"use client";

import React, { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateContentCalendarAction } from "@/app/ai-tools/content-calendar-planner/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import type { ContentCalendarPlannerOutput } from "@/ai/flows/content-calendar-planner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          প্ল্যান করা হচ্ছে...
        </>
      ) : (
        <>
          <CalendarDays className="mr-2 h-5 w-5" />
          ক্যালেন্ডার তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function ContentCalendarPlannerForm() {
  const [data, setData] = useState<ContentCalendarPlannerOutput | undefined>(undefined);
  const [issues, setIssues] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setData(undefined);
    setIssues([]);
    const result = await generateContentCalendarAction(formData);
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
        <CardTitle>কনটেন্ট ক্যালেন্ডার তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার ব্লগ বা সোশ্যাল মিডিয়ার জন্য একটি সুগঠিত কনটেন্ট প্ল্যান তৈরি করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">কেন্দ্রীয় থিম বা বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, স্বাস্থ্যকর জীবনযাত্রা, ডিজিটাল মার্কেটিং টিপস"
              required
            />
            {getIssueMessage('topic') && <p className="text-sm font-medium text-destructive">{getIssueMessage('topic')}</p>}
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>প্ল্যাটফর্ম</Label>
                    <RadioGroup name="platform" defaultValue="Blog" className="flex gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Blog" id="blog" />
                            <Label htmlFor="blog">ব্লগ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Social Media" id="social" />
                            <Label htmlFor="social">সোশ্যাল মিডিয়া</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">সময়কাল</Label>
                    <Select name="duration" required>
                        <SelectTrigger id="duration">
                            <SelectValue placeholder="সময়কাল নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1 week">১ সপ্তাহ</SelectItem>
                            <SelectItem value="2 weeks">২ সপ্তাহ</SelectItem>
                            <SelectItem value="1 month">১ মাস</SelectItem>
                        </SelectContent>
                    </Select>
                     {getIssueMessage('duration') && <p className="text-sm font-medium text-destructive">{getIssueMessage('duration')}</p>}
                </div>
            </div>
          
          <SubmitButton />
        </form>

        {isSubmitting && (
            <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার ক্যালেন্ডার তৈরি হচ্ছে...</p>
                </div>
            </div>
        )}

        {data?.calendar && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold font-headline text-center">আপনার কনটেন্ট ক্যালেন্ডার</h3>
            <Accordion type="single" collapsible className="w-full">
                {data.calendar.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-base font-semibold">
                           {item.day}: {item.postTitle}
                        </AccordionTrigger>
                        <AccordionContent>
                           <p className="text-muted-foreground mb-2">{item.description}</p>
                           {item.suggestedHashtags && (
                               <div className="flex flex-wrap gap-2">
                                  {item.suggestedHashtags.split(' ').map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                               </div>
                           )}
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
