
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { translateText } from "@/app/ai-tools/bengali-translator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Languages } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          অনুবাদ করা হচ্ছে...
        </>
      ) : (
        <>
          <Languages className="mr-2 h-5 w-5" />
          অনুবাদ করুন
        </>
      )}
    </Button>
  );
}

export default function BengaliTranslatorForm() {
  const initialState = { message: "", translatedText: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(translateText, initialState);
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
    if (state.translatedText) {
      navigator.clipboard.writeText(state.translatedText);
      toast({
        title: "কপি করা হয়েছে!",
        description: "অনूदিত পাঠ্য ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>কনটেন্ট অনুবাদ করুন</CardTitle>
        <CardDescription>
          পাঠ্য লিখুন এবং লক্ষ্য ভাষা নির্বাচন করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="textToTranslate">অনুবাদ করার জন্য পাঠ্য</Label>
            <Textarea
              id="textToTranslate"
              name="textToTranslate"
              placeholder="এখানে পাঠ্য লিখুন..."
              defaultValue={state.fields?.textToTranslate}
              required
              rows={5}
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("text"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <div className="space-y-2">
            <Label>অনুবাদ করুন</Label>
            <RadioGroup name="targetLanguage" defaultValue="Bengali" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Bengali" id="bengali" />
                <Label htmlFor="bengali">বাংলা</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="English" id="english" />
                <Label htmlFor="english">ইংরেজি</Label>
              </div>
            </RadioGroup>
          </div>

          <SubmitButton />
        </form>

        {state.translatedText && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">অনूदিত পাঠ্য</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.translatedText}</p>
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
