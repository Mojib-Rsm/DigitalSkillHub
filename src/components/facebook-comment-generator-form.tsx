
"use client";

import React from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateFacebookComments } from "@/app/ai-tools/facebook-comment-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, MessageSquare, Upload, X } from "lucide-react";
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
          <MessageSquare className="mr-2 h-5 w-5" />
          কমেন্ট তৈরি করুন
        </>
      )}
    </Button>
  );
}

const SuggestionsList = ({ title, suggestions }: { title: string, suggestions: string[] }) => {
    const { toast } = useToast();
    
    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({
        title: "কপি করা হয়েছে!",
        description: "সুপারিশটি ক্লিপবোর্ডে কপি করা হয়েছে।",
        });
    };

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold font-headline mb-4 text-center">{title}</h3>
            <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
                <Card key={index} className="bg-muted/50 relative group">
                <CardContent className="p-4 pr-12">
                    <p className="text-muted-foreground">{suggestion}</p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(suggestion)}>
                        <Clipboard className="w-5 h-5"/>
                    </Button>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
    );
};

export default function FacebookCommentGeneratorForm() {
  const initialState = { message: "", bengaliSuggestions: [], englishSuggestions: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateFacebookComments, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pastedFile, setPastedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
      setPreviewUrl(null);
      setPastedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
     if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
          toast({
              variant: "destructive",
              title: "ফাইল খুবই বড়",
              description: "ছবির আকার 4MB এর বেশি হতে পারবে না।",
          });
          if(fileInputRef.current) {
              fileInputRef.current.value = "";
          }
          setPreviewUrl(null);
          setPastedFile(null);
          return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPastedFile(file);
    } else {
      setPreviewUrl(null);
      setPastedFile(null);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileChange(file || null);
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setPastedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
                handleFileChange(file);
                // Prevent the image from being pasted into the textarea
                event.preventDefault(); 
            }
        }
    }
  };

  const customFormAction = (formData: FormData) => {
    if(pastedFile) {
        // If a file was pasted, it won't be in the form's file input.
        // We need to append it to the FormData object manually.
        formData.set('photo', pastedFile);
    }
    formAction(formData);
  }

  return (
    <Card className="shadow-lg" onPaste={handlePaste}>
      <CardHeader>
        <CardTitle>কমেন্ট বা রিপ্লাই তৈরি করুন</CardTitle>
        <CardDescription>
          পোস্টের বিষয়বস্তু দিন, ছবি পেস্ট করুন এবং আপনার লক্ষ্য জানান। এআই বাকিটা করবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={customFormAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="postContent">পোস্টের বিষয়বস্তু</Label>
            <Textarea
              id="postContent"
              name="postContent"
              placeholder="আপনি যে পোস্টে কমেন্ট করতে চান তা এখানে পেস্ট করুন..."
              defaultValue={state.fields?.postContent}
              rows={5}
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("পোস্ট") || issue.toLowerCase().includes("post")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">ছবি আপলোড করুন বা পেস্ট করুন (ঐচ্ছিক, সর্বোচ্চ 4MB)</Label>
            <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
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
            {state.issues?.filter((issue) => issue.toLowerCase().includes("ছবি") || issue.toLowerCase().includes("image") || issue.toLowerCase().includes("jpg")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">আপনার লক্ষ্য (ঐচ্ছিক)</Label>
            <Input
              id="goal"
              name="goal"
              placeholder="যেমন, একটি ইতিবাচক কমেন্ট লিখুন, একটি প্রশ্ন জিজ্ঞাসা করুন..."
              defaultValue={state.fields?.goal}
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("goal")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {(state.bengaliSuggestions && state.bengaliSuggestions.length > 0) || (state.englishSuggestions && state.englishSuggestions.length > 0) ? (
            <div>
                 <SuggestionsList title="বাংলা সাজেশন" suggestions={state.bengaliSuggestions!} />
                 <SuggestionsList title="English Suggestions" suggestions={state.englishSuggestions!} />
            </div>
        ) : null}

      </CardContent>
    </Card>
  );
}
