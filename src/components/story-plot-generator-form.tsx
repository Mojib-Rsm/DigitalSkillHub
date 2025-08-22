
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateStoryPlot } from "@/app/ai-tools/story-plot-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, GitBranchPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          প্লট তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <GitBranchPlus className="mr-2 h-5 w-5" />
          গল্পের প্লট তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function StoryPlotGeneratorForm() {
  const initialState = { message: "", plot: undefined, issues: [], fields: {} };
  const [state, formAction] = useActionState(generateStoryPlot, initialState);
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
        <CardTitle>গল্পের প্লট তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার গল্পের জন্য একটি সম্পূর্ণ প্লট পেতে কিছু বিবরণ দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="genre">গল্পের ধরণ (Genre)</Label>
            <Input
              id="genre"
              name="genre"
              placeholder="যেমন, বিজ্ঞান কল্পকাহিনী, রহস্য, রোমান্টিক"
              defaultValue={state.fields?.genre}
              required
            />
            {state.issues?.filter(i => i.includes("genre")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="premise">মূল ধারণা (Premise)</Label>
            <Textarea
              id="premise"
              name="premise"
              placeholder="যেমন, এক মহাকাশচারী একটি পরিত্যক্ত গ্রহে একটি রহস্যময় সংকেত খুঁজে পায়।"
              defaultValue={state.fields?.premise}
              required
              rows={2}
            />
             {state.issues?.filter(i => i.includes("premise")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="keyElements">মূল উপাদান (Key Elements)</Label>
            <Input
              id="keyElements"
              name="keyElements"
              placeholder="যেমন, একটি রোবট সঙ্গী, একটি প্রাচীন এলিয়েন সভ্যতা, একটি টাইম লুপ"
              defaultValue={state.fields?.keyElements}
              required
            />
             {state.issues?.filter(i => i.includes("element")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <SubmitButton />
        </form>

        {state.plot && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold font-headline text-center">আপনার গল্পের প্লট</h3>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">Suggested Title: {state.plot.title}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="font-semibold">Logline:</p>
                    <p className="italic text-muted-foreground">{state.plot.logline}</p>
                 </CardContent>
            </Card>
            <Card className="bg-muted/50 relative">
                <CardHeader>
                    <CardTitle className="text-lg">Plot Outline</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-muted-foreground whitespace-pre-wrap font-sans">{state.plot.plotOutline}</pre>
                </CardContent>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopy(state.plot!.plotOutline)}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
