
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateHeadlines } from "@/app/ai-tools/headline-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, PanelTopOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          শিরোনাম তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <PanelTopOpen className="mr-2 h-5 w-5" />
          শিরোনাম তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function HeadlineGeneratorForm() {
  const initialState = { message: "", headlines: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateHeadlines, initialState);
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
      description: "শিরোনামটি ক্লিপবোর্ডে কপি করা হয়েছে।",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আকর্ষণীয় শিরোনাম তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার কনটেন্টের জন্য সঠিক শিরোনাম খুঁজে পেতে নিচের তথ্যগুলো দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, এআই কিভাবে চাকরি পরিবর্তন করছে"
              defaultValue={state.fields?.topic}
              required
            />
            {state.issues?.filter(i => i.includes("topic")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="contentType">কনটেন্টের ধরন</Label>
                <Input
                id="contentType"
                name="contentType"
                placeholder="যেমন, ব্লগ পোস্ট, ইউটিউব ভিডিও"
                defaultValue={state.fields?.contentType}
                required
                />
                {state.issues?.filter(i => i.includes("content type")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
                <Label htmlFor="tone">টোন</Label>
                <Select name="tone" defaultValue={state.fields?.tone}>
                    <SelectTrigger id="tone">
                        <SelectValue placeholder="টোন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Professional">পেশাদার</SelectItem>
                        <SelectItem value="Clickbait">ক্লিকবেট</SelectItem>
                        <SelectItem value="Controversial">বিতর্কিত</SelectItem>
                        <SelectItem value="Informative">তথ্যবহুল</SelectItem>
                        <SelectItem value="Funny">মজাদার</SelectItem>
                    </SelectContent>
                </Select>
                {state.issues?.filter(i => i.includes("tone")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          
          <SubmitButton />
        </form>

        {state.headlines && state.headlines.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="text-2xl font-bold font-headline text-center">সুপারিশকৃত শিরোনাম</h3>
             {state.headlines.map((headline, index) => (
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
        )}
      </CardContent>
    </Card>
  );
}
