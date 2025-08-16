
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
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Translating...
        </>
      ) : (
        <>
          <Languages className="mr-2 h-5 w-5" />
          Translate
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
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.translatedText) {
      navigator.clipboard.writeText(state.translatedText);
      toast({
        title: "Copied!",
        description: "Translated text copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Translate Content</CardTitle>
        <CardDescription>
          Enter text and select the target language.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="textToTranslate">Text to Translate</Label>
            <Textarea
              id="textToTranslate"
              name="textToTranslate"
              placeholder="Enter text here..."
              defaultValue={state.fields?.textToTranslate}
              required
              rows={5}
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("text"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <div className="space-y-2">
            <Label>Translate to</Label>
            <RadioGroup name="targetLanguage" defaultValue="Bengali" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Bengali" id="bengali" />
                <Label htmlFor="bengali">Bengali</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="English" id="english" />
                <Label htmlFor="english">English</Label>
              </div>
            </RadioGroup>
          </div>

          <SubmitButton />
        </form>

        {state.translatedText && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Translated Text</h3>
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
