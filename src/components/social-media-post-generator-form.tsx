
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generatePost } from "@/app/ai-tools/social-media-post-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Hash } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
          <Hash className="mr-2 h-5 w-5" />
          পোস্ট জেনারেট করুন
        </>
      )}
    </Button>
  );
}

export default function SocialMediaPostGeneratorForm() {
  const initialState = { message: "", post: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generatePost, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.post) {
      navigator.clipboard.writeText(state.post);
      toast({
        title: "কপি করা হয়েছে!",
        description: "সোশ্যাল মিডিয়া পোস্ট ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>একটি সোশ্যাল মিডিয়া পোস্ট তৈরি করুন</CardTitle>
        <CardDescription>
          একটি বিষয় লিখুন এবং এআইকে আপনার দর্শকদের জন্য সেরা পোস্টটি তৈরি করতে দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">পোস্টের বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, একটি নতুন হস্তনির্মিত গহনা সংগ্রহ চালু করা"
              defaultValue={state.fields?.topic}
              required
            />
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("topic"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">প্ল্যাটফর্ম</Label>
              <Select name="platform" defaultValue={state.fields?.platform}>
                  <SelectTrigger id="platform">
                      <SelectValue placeholder="প্ল্যাটফর্ম নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Facebook">ফেসবুক</SelectItem>
                      <SelectItem value="Instagram">ইনস্টাগ্রাম</SelectItem>
                      <SelectItem value="Twitter">টুইটার</SelectItem>
                      <SelectItem value="LinkedIn">লিঙ্কডইন</SelectItem>
                  </SelectContent>
              </Select>
               {state.issues
                ?.filter((issue) => issue.toLowerCase().includes("platform"))
                .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
                <Label htmlFor="tone">ধরণ</Label>
                <Select name="tone" defaultValue={state.fields?.tone}>
                    <SelectTrigger id="tone">
                        <SelectValue placeholder="ধরণ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Casual">সাধারণ</SelectItem>
                        <SelectItem value="Formal">ফরমাল</SelectItem>
                        <SelectItem value="Funny">মজাদার</SelectItem>
                        <SelectItem value="Inspirational">অনুপ্রেরণামূলক</SelectItem>
                    </SelectContent>
                </Select>
                 {state.issues
                  ?.filter((issue) => issue.toLowerCase().includes("tone"))
                  .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          <SubmitButton />
        </form>

        {state.post && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড পোস্ট</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.post}</p>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
