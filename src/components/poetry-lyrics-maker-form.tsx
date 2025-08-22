
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generatePoetryOrLyrics } from "@/app/ai-tools/poetry-lyrics-maker/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Mic } from "lucide-react";
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
          লেখা হচ্ছে...
        </>
      ) : (
        <>
          <Mic className="mr-2 h-5 w-5" />
          তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function PoetryLyricsMakerForm() {
  const initialState = { message: "", data: undefined, issues: [], fields: {} };
  const [state, formAction] = useActionState(generatePoetryOrLyrics, initialState);
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
        <CardTitle>কবিতা বা গান লিখুন</CardTitle>
        <CardDescription>
          আপনার অনুভূতি প্রকাশ করতে একটি বিষয়, ধরণ এবং মেজাজ দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label>কী তৈরি করতে চান?</Label>
            <RadioGroup name="type" defaultValue="Poem" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Poem" id="poem" />
                <Label htmlFor="poem">কবিতা</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Song Lyrics" id="lyrics" />
                <Label htmlFor="lyrics">গানের কথা</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">বিষয়</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="যেমন, বর্ষার একটি সন্ধ্যা, হারানো প্রেম"
              defaultValue={state.fields?.topic}
              required
            />
            {state.issues?.filter(i => i.includes("topic")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mood">মেজাজ (Mood)</Label>
            <Input
              id="mood"
              name="mood"
              placeholder="যেমন, আনন্দময়, বিষণ্ণ, রোমান্টিক"
              defaultValue={state.fields?.mood}
              required
            />
             {state.issues?.filter(i => i.includes("mood")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="keywords">কীওয়ার্ড (কমা দ্বারা পৃথক)</Label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="যেমন, বৃষ্টি, কফি, স্মৃতি, চাঁদ"
              defaultValue={state.fields?.keywords}
              required
            />
             {state.issues?.filter(i => i.includes("keyword")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <SubmitButton />
        </form>

        {state.data && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold font-headline text-center">{state.data.title}</h3>
            <Card className="bg-muted/50 relative">
                <CardContent className="p-4 max-h-96 overflow-y-auto">
                    <pre className="text-muted-foreground whitespace-pre-wrap font-sans">{state.data.content}</pre>
                </CardContent>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopy(state.data!.content)}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
