
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateImage } from "@/app/ai-tools/image-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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
          <ImageIcon className="mr-2 h-5 w-5" />
          ছবি জেনারেট করুন
        </>
      )}
    </Button>
  );
}

export default function ImageGeneratorForm() {
  const initialState = { message: "", imageUrl: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateImage, initialState);
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>ছবি তৈরির প্রম্পট</CardTitle>
        <CardDescription>
          আপনি যে ছবিটি তৈরি করতে চান তার বিস্তারিত বর্ণনা দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">প্রম্পট</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="যেমন, 'স্কিল স্প্রাউট' ব্র্যান্ডের জন্য একটি মিনিমালিস্ট লোগো, যেখানে একটি ডিজিটাল সার্কিট থেকে একটি সবুজ চারা গজিয়েছে। পরিষ্কার, আধুনিক, ভেক্টর আর্ট।"
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
                    <p className="text-muted-foreground animate-pulse">আপনার ছবি তৈরি হচ্ছে, এটি কিছু সময় নিতে পারে...</p>
                </div>
            </div>
        )}

        {state.imageUrl && !useFormStatus().pending &&(
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড ছবি</h3>
            <Card className="bg-muted/50 relative overflow-hidden">
                <Image src={state.imageUrl} alt="Generated image" width={1024} height={1024} className="w-full object-contain"/>
            </Card>
            <Button asChild className="w-full mt-4" size="lg">
                <a href={state.imageUrl} download="generated-image.png">
                    ছবি ডাউনলোড করুন
                </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
