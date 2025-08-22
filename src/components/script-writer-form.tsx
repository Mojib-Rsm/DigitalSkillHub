
"use client";

import React, { useState } from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateScript } from "@/app/ai-tools/script-writer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          স্ক্রিপ্ট লেখা হচ্ছে...
        </>
      ) : (
        <>
          <Youtube className="mr-2 h-5 w-5" />
          স্ক্রিপ্ট তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function ScriptWriterForm() {
  const initialState = { message: "", script: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateScript, initialState);
  const [duration, setDuration] = useState(3);
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

  const handleCopy = () => {
    if (state.script) {
      navigator.clipboard.writeText(state.script);
      toast({
        title: "কপি করা হয়েছে!",
        description: "স্ক্রিপ্টটি ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>ভিডিও স্ক্রিপ্ট তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার ভিডিওর জন্য একটি সম্পূর্ণ স্ক্রিপ্ট পেতে নিচের বিবরণ দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">ভিডিওর বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, বাংলাদেশে ফ্রিল্যান্সিং এর ভবিষ্যৎ"
              defaultValue={state.fields?.topic as string}
              required
            />
            {state.issues?.filter(i => i.includes("topic")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="style">স্ক্রিপ্টের স্টাইল</Label>
            <Input
              id="style"
              name="style"
              placeholder="যেমন, শিক্ষামূলক, মজাদার, তথ্যবহুল"
              defaultValue={state.fields?.style as string}
              required
            />
            {state.issues?.filter(i => i.includes("style")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label>ভিডিওর প্ল্যাটফর্ম</Label>
            <RadioGroup name="platform" defaultValue="YouTube" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="YouTube" id="youtube" />
                <Label htmlFor="youtube">ইউটিউব</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TikTok" id="tiktok" />
                <Label htmlFor="tiktok">টিকটক</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationInMinutes">ভিডিওর দৈর্ঘ্য (মিনিট): {duration}</Label>
            <input type="hidden" name="durationInMinutes" value={duration} />
            <Slider
              id="durationInMinutes"
              min={1}
              max={10}
              step={1}
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
            />
          </div>

          <SubmitButton />
        </form>

        {state.script && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড স্ক্রিপ্ট</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4 max-h-96 overflow-y-auto">
                <pre className="text-muted-foreground whitespace-pre-wrap font-sans">{state.script}</pre>
              </CardContent>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                <Clipboard className="w-5 h-5"/>
              </Button>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
