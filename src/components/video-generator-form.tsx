
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateVideo } from "@/app/ai-tools/video-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Film } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

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
          <Film className="mr-2 h-5 w-5" />
          ভিডিও জেনারেট করুন
        </>
      )}
    </Button>
  );
}

export default function VideoGeneratorForm() {
  const initialState = { message: "", videoUrl: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateVideo, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
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
        <CardTitle>ভিডিও তৈরির প্রম্পট</CardTitle>
        <CardDescription>
          আপনি যে ভিডিওটি তৈরি করতে চান তার বিস্তারিত বর্ণনা দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">প্রম্পট</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="যেমন, 'A majestic dragon soaring over a mystical forest at dawn.'"
              defaultValue={state.fields?.prompt}
              required
              rows={5}
            />
            {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {useFormStatus().pending && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার ভিডিও তৈরি হচ্ছে, এটি কয়েক মিনিট সময় নিতে পারে...</p>
                </div>
            </div>
        )}

        {state.videoUrl && !useFormStatus().pending && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড ভিডিও</h3>
            <Card className="bg-muted/50 relative overflow-hidden">
                <video controls src={state.videoUrl} className="w-full" />
            </Card>
            <Button asChild className="w-full mt-4" size="lg">
                <a href={state.videoUrl} download="generated-video.mp4">
                    ভিডিও ডাউনলোড করুন
                </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
