
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateVideoFromImage } from "@/app/ai-tools/image-to-video-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Film, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Input } from "./ui/input";

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

export default function ImageToVideoGeneratorForm() {
  const initialState = { message: "", videoUrl: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateVideoFromImage, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
          toast({
              variant: "destructive",
              title: "ফাইল খুবই বড়",
              description: "ছবির আকার 4MB এর বেশি হতে পারবে না।",
          });
          if(fileInputRef.current) fileInputRef.current.value = "";
          setPreviewUrl(null);
          return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>ভিডিও তৈরির প্রম্পট</CardTitle>
        <CardDescription>
          একটি ছবি আপলোড করুন এবং ভিডিওতে কী ঘটবে তার বর্ণনা দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="photo">ছবি আপলোড করুন (সর্বোচ্চ 4MB)</Label>
            <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {previewUrl && (
                <div className="mt-2 relative w-32 h-32">
                    <Image src={previewUrl} alt="Image preview" layout="fill" className="rounded-md object-cover"/>
                    <Button variant="destructive" size="icon" onClick={handleRemoveImage} className="absolute -top-2 -right-2 h-6 w-6 rounded-full">
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            {state.issues?.filter((issue) => issue.toLowerCase().includes("ছবি") || issue.toLowerCase().includes("jpg")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">প্রম্পট</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="যেমন, 'make the subject in the photo move', 'make this image a cinematic video'"
              defaultValue={state.fields?.prompt}
              required
              rows={3}
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
