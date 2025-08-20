
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generatePromptAction } from "@/app/ai-tools/prompt-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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
          <Sparkles className="mr-2 h-5 w-5" />
          প্রম্পট তৈরি করুন
        </>
      )}
    </Button>
  );
}

const PromptList = ({ title, prompts }: { title: string; prompts: string[] }) => {
    const { toast } = useToast();
    
    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({
        title: "কপি করা হয়েছে!",
        description: "প্রম্পটটি ক্লিপবোর্ডে কপি করা হয়েছে।",
        });
    };

    if (!prompts || prompts.length === 0) return null;

    return (
        <div>
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <div className="space-y-3">
            {prompts.map((prompt, index) => (
                <Card key={index} className="bg-muted/50 relative group">
                <CardContent className="p-4 pr-12">
                    <p className="text-muted-foreground whitespace-pre-wrap">{prompt}</p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(prompt)}>
                        <Clipboard className="w-5 h-5"/>
                    </Button>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
    );
};


export default function PromptGeneratorForm() {
  const initialState = { message: "", prompts: undefined, issues: [], fields: {} };
  const [state, formAction] = useActionState(generatePromptAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      // Do not reset form
    }
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
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
        <CardTitle>আপনার ধারণা থেকে প্রম্পট তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার ধারণা বর্ণনা করুন এবং এআই আপনার জন্য একটি বিস্তারিত প্রম্পট তৈরি করবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">আপনার ধারণা বা বিষয়</Label>
            <Textarea
              id="topic"
              name="topic"
              placeholder="যেমন, ঢাকার রাস্তায় একটি রিকশার ছবি, বৃষ্টির দিনে একটি বিড়ালের ভিডিও"
              defaultValue={state.fields?.topic}
              required
              rows={4}
            />
            {state.issues?.filter(i => i.toLowerCase().includes("topic")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>মিডিয়ার ধরন</Label>
                <RadioGroup name="mediaType" defaultValue={state.fields?.mediaType || "Image"} className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Image" id="image" />
                        <Label htmlFor="image">ছবি</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Video" id="video" />
                        <Label htmlFor="video">ভিডিও</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Audio" id="audio" />
                        <Label htmlFor="audio">অডিও</Label>
                    </div>
                </RadioGroup>
                 {state.issues?.filter(i => i.toLowerCase().includes("media")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
             <div className="space-y-2">
                <Label>প্রম্পটের ভাষা</Label>
                <RadioGroup name="language" defaultValue={state.fields?.language || "Bengali"} className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Bengali" id="bengali" />
                        <Label htmlFor="bengali">বাংলা</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="English" id="english" />
                        <Label htmlFor="english">English</Label>
                    </div>
                </RadioGroup>
                 {state.issues?.filter(i => i.toLowerCase().includes("language")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          
          <SubmitButton />
        </form>

        {state.prompts && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড প্রম্পট</h3>
            <div className="space-y-6">
                <PromptList title="সংক্ষিপ্ত প্রম্পট" prompts={state.prompts.shortPrompts} />
                <PromptList title="বিস্তারিত প্রম্পট" prompts={state.prompts.longPrompts} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
