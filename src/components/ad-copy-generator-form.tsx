
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateAdCopy } from "@/app/ai-tools/ad-copy-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          কপি তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <Megaphone className="mr-2 h-5 w-5" />
          বিজ্ঞাপনের কপি তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function AdCopyGeneratorForm() {
  const initialState = { message: "", data: undefined, issues: [], fields: {} };
  const [state, formAction] = useActionState(generateAdCopy, initialState);
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি করা হয়েছে!",
      description: "টেক্সট ক্লিপবোর্ডে কপি করা হয়েছে।",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>বিজ্ঞাপনের কপি তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার পণ্য বা পরিষেবা সম্পর্কে তথ্য দিন এবং প্ল্যাটফর্ম-নির্দিষ্ট বিজ্ঞাপনের কপি পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName">পণ্যের নাম</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="যেমন, অর্গানিক গ্রিন টি"
              defaultValue={state.fields?.productName}
              required
            />
            {state.issues?.filter(i => i.includes("product name")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="productDescription">পণ্যের বর্ণনা</Label>
            <Textarea
              id="productDescription"
              name="productDescription"
              placeholder="যেমন, অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ, সতেজ এবং সম্পূর্ণ প্রাকৃতিক।"
              defaultValue={state.fields?.productDescription}
              required
              rows={3}
            />
             {state.issues?.filter(i => i.includes("product description")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="targetAudience">লক্ষ্য দর্শক</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="যেমন, স্বাস্থ্য-সচেতন তরুণ পেশাজীবী"
              defaultValue={state.fields?.targetAudience}
              required
            />
             {state.issues?.filter(i => i.includes("audience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <div className="space-y-2">
            <Label>প্ল্যাটফর্ম</Label>
            <RadioGroup name="platform" defaultValue="Facebook Ads" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Facebook Ads" id="facebook" />
                <Label htmlFor="facebook">ফেসবুক বিজ্ঞাপন</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Google Ads" id="google" />
                <Label htmlFor="google">গুগল বিজ্ঞাপন</Label>
              </div>
            </RadioGroup>
          </div>

          <SubmitButton />
        </form>

        {state.data && (
          <div className="mt-8 space-y-6">
            <div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড হেডলাইন</h3>
                <div className="space-y-3">
                {state.data.headlines.map((headline, index) => (
                    <Card key={index} className="bg-muted/50 relative group">
                    <CardContent className="p-3 flex items-center gap-3">
                        <p className="font-medium flex-1">{headline}</p>
                         <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleCopy(headline)}>
                            <Clipboard className="w-4 h-4"/>
                        </Button>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
             <div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড বডি টেক্সট</h3>
                 <Card className="bg-muted/50 relative group">
                    <CardContent className="p-4">
                        <p className="text-muted-foreground whitespace-pre-wrap">{state.data.body}</p>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => handleCopy(state.data!.body)}>
                            <Clipboard className="w-5 h-5"/>
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
