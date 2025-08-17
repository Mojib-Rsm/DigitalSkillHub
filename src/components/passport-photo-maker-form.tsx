
"use client";

import React from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { generatePassportPhoto } from "@/app/ai-tools/passport-photo-maker/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, UserCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          ছবি তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <UserCircle className="mr-2 h-5 w-5" />
          ছবি তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function PassportPhotoMakerForm() {
  const initialState = { message: "", imageUrl: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generatePassportPhoto, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
        <CardTitle>আপনার ছবি আপলোড করুন</CardTitle>
        <CardDescription>
          একটি পোর্ট্রেট ছবি আপলোড করুন এবং একটি পটভূমির রঙ নির্বাচন করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="photo">আপনার ছবি (সর্বোচ্চ 4MB)</Label>
            <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
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
            <Label>পটভূমির রঙ</Label>
            <RadioGroup name="backgroundColor" defaultValue="White" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="White" id="white" />
                <Label htmlFor="white">সাদা</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Light Blue" id="blue" />
                <Label htmlFor="blue">হালকা নীল</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Grey" id="grey" />
                <Label htmlFor="grey">ধূসর</Label>
              </div>
            </RadioGroup>
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
                <Image src={state.imageUrl} alt="Generated passport photo" width={400} height={400} className="w-1/2 mx-auto object-contain"/>
            </Card>
            <Button asChild className="w-full mt-4" size="lg">
                <a href={state.imageUrl} download="passport-photo.png">
                    ছবি ডাউনলোড করুন
                </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
