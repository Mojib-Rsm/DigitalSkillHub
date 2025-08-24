
"use client";

import React, { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateFacebookCaptions } from "@/app/ai-tools/facebook-caption-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, MessageSquare, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { FacebookCaptionGeneratorOutput } from "@/ai/flows/facebook-caption-generator";
import { Badge } from "./ui/badge";

function SubmitButton({isSubmitting}: {isSubmitting: boolean}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSubmitting;
  return (
    <Button type="submit" disabled={isDisabled} size="lg" className="w-full">
      {isDisabled ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          ক্যাপশন তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <MessageSquare className="mr-2 h-5 w-5" />
          ক্যাপশন তৈরি করুন
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
        description: "ক্যাপশনটি ক্লিপবোর্ডে কপি করা হয়েছে।",
        });
    };

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div>
            <h3 className="text-xl font-bold font-headline mb-4">{title}</h3>
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

export default function FacebookCaptionGeneratorForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<FacebookCaptionGeneratorOutput | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setResult(null);
    setIssues([]);
    try {
      const response = await generateFacebookCaptions(formData);
      if (response.success && response.data) {
        setResult(response.data);
      } else if (response.issues) {
        setIssues(response.issues);
      }
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: errorMessage,
        })
    }
    setIsSubmitting(false);
  }

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
          return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileChange(file || null);
  }

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    let file = null;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            file = items[i].getAsFile();
            break; 
        }
    }
    if (file) {
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
            // Manually trigger the change event
            const changeEvent = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(changeEvent);
        }
        handleFileChange(file);
        event.preventDefault();
    }
  };

  return (
    <Card className="shadow-lg" onPaste={handlePaste}>
      <CardHeader>
        <CardTitle>ফেসবুক ক্যাপশন তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার ছবি আপলোড করুন এবং ঐচ্ছিকভাবে একটি বিষয় বর্ণনা করুন। এআই বাকিটা করবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="photo">ছবি আপলোড করুন বা পেস্ট করুন (সর্বোচ্চ 4MB)</Label>
            <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {previewUrl && (
                <div className="mt-2 relative w-full aspect-video border rounded-md">
                    <Image src={previewUrl} alt="Image preview" fill className="rounded-md object-contain p-2"/>
                    <Button type="button" variant="destructive" size="icon" onClick={handleRemoveImage} className="absolute -top-2 -right-2 h-6 w-6 rounded-full">
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            {issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postTopic">পোস্টের বিষয়বস্তু (ঐচ্ছিক)</Label>
            <Textarea
              id="postTopic"
              name="postTopic"
              placeholder="আপনি পোস্টের মাধ্যমে কী বোঝাতে চান তা এখানে লিখুন..."
              rows={3}
            />
          </div>
          <SubmitButton isSubmitting={isSubmitting} />
        </form>

        {result && (
            <div className="mt-8 space-y-6">
                 <SuggestionsList title="বাংলা ক্যাপশন" suggestions={result.bengaliCaptions} />
                 <SuggestionsList title="English Captions" suggestions={result.englishCaptions} />
                 <div>
                    <h3 className="text-xl font-bold font-headline mb-4">প্রস্তাবিত হ্যাশট্যাগ</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.hashtags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                 </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
