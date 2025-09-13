
"use client";

import React, { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateStampAction } from "@/app/ai-tools/digital-stamp-maker/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Stamp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DigitalStampMakerOutput } from "@/ai/flows/digital-stamp-maker";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <Stamp className="mr-2 h-5 w-5" />
          স্ট্যাম্প তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function DigitalStampMakerForm() {
  const [data, setData] = useState<DigitalStampMakerOutput | undefined>(undefined);
  const [issues, setIssues] = useState<Record<string, string[]> | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
      setIsSubmitting(true);
      setData(undefined);
      setIssues(undefined);

      const result = await generateStampAction(formData);

      if (result.success) {
          setData(result.data);
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
        <CardTitle>ডিজিটাল স্ট্যাম্প মেকার</CardTitle>
        <CardDescription>
          আপনার প্রতিষ্ঠান বা ব্যক্তিগত ব্যবহারের জন্য ডিজিটাল স্ট্যাম্প তৈরি করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">প্রতিষ্ঠানের নাম</Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="যেমন, TotthoAi Limited"
              required
            />
            {issues?.companyName && <p className="text-sm font-medium text-destructive">{issues.companyName[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">ট্যাগলাইন (ঐচ্ছিক)</Label>
            <Input
              id="tagline"
              name="tagline"
              placeholder="যেমন, Your AI Partner"
            />
          </div>
          
          <div className="space-y-2">
            <Label>আকৃতি</Label>
            <RadioGroup name="shape" defaultValue="Circle" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Circle" id="circle" />
                <Label htmlFor="circle">বৃত্তাকার</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Square" id="square" />
                <Label htmlFor="square">বর্গাকার</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rectangle" id="rectangle" />
                <Label htmlFor="rectangle">আয়তক্ষেত্র</Label>
              </div>
            </RadioGroup>
          </div>

           <div className="space-y-2">
            <Label htmlFor="style">স্টাইল</Label>
            <Input
              id="style"
              name="style"
              placeholder="যেমন, modern, vintage, official"
              required
            />
             {issues?.style && <p className="text-sm font-medium text-destructive">{issues.style[0]}</p>}
          </div>

          <SubmitButton />
        </form>

        {isSubmitting && (
            <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার স্ট্যাম্প তৈরি হচ্ছে...</p>
                </div>
            </div>
        )}

        {data?.imageUrl && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">আপনার ডিজিটাল স্ট্যাম্প</h3>
             <Card className="bg-muted/50 relative overflow-hidden">
                <Image src={data.imageUrl} alt="Generated stamp" width={512} height={512} className="w-full object-contain"/>
            </Card>
            <Button asChild className="w-full mt-4" size="lg">
                <a href={data.imageUrl} download="digital-stamp.png">
                    স্ট্যাম্প ডাউনলোড করুন
                </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
