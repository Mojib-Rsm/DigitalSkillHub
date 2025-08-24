
"use client";

import React, { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateTopicsAction } from "@/app/ai-tools/blog-topic-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogTopicGeneratorOutput } from "@/ai/flows/blog-topic-generator";
import { Alert, AlertDescription } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";


function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isSubmitting} size="lg" className="w-full">
      {pending || isSubmitting ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          জেনারেট করা হচ্ছে...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          টপিক জেনারেট করুন
        </>
      )}
    </Button>
  );
}

export default function BlogTopicGeneratorForm() {
  const [data, setData] = useState<BlogTopicGeneratorOutput | undefined>(undefined);
  const [issues, setIssues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setData(undefined);
    setIssues([]);

    const formData = new FormData(event.currentTarget);
    const result = await generateTopicsAction({
        topic: formData.get("topic") as string,
        language: formData.get("language") as "Bengali" | "English",
    });

    if (result.success) {
        setData(result.data);
    } else {
        setIssues(result.issues || ["An unknown error occurred."]);
        toast({
            variant: "destructive",
            title: "Error",
            description: result.issues?.join(", ") || "An unknown error occurred.",
        });
    }

    setIsSubmitting(false);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার পরবর্তী ধারণা তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার বিষয় বা কীওয়ার্ড লিখুন এবং এআইকে সৃজনশীল কাজটি করতে দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">আপনার বিষয় বা কীওয়ার্ড</Label>
            <Textarea
              id="topic"
              name="topic"
              placeholder="যেমন, ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং টিপস, এআই টুলস"
              required
              rows={4}
            />
          </div>

           <div className="space-y-2">
            <Label>টপিকের ভাষা</Label>
            <RadioGroup name="language" defaultValue="Bengali" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Bengali" id="bengali" />
                <Label htmlFor="bengali">বাংলা</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="English" id="english" />
                <Label htmlFor="english">English</Label>
              </div>
            </RadioGroup>
          </div>

          {issues.length > 0 && (
            <Alert variant="destructive">
                <AlertDescription>
                    <ul className="list-disc pl-4">
                        {issues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                </AlertDescription>
            </Alert>
          )}

          <SubmitButton isSubmitting={isSubmitting}/>
        </form>

        {(isSubmitting) && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground font-semibold animate-pulse">আপনার টপিক তৈরি হচ্ছে...</p>
                </div>
            </div>
        )}

        {data?.topics && data.topics.length > 0 && !isSubmitting && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড টপিকস</h3>
            <div className="space-y-3">
              {data.topics.map((topic, index) => (
                <Card key={index} className="bg-background/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Lightbulb className="w-6 h-6 text-accent"/>
                    <p className="font-medium flex-1">{topic}</p>
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
