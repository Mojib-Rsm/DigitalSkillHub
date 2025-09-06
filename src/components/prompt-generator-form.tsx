
"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { generatePromptAction } from "@/app/ai-tools/prompt-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import type { PromptGeneratorOutput } from "@/ai/flows/prompt-generator";
import { Input } from "./ui/input";
import Image from "next/image";
import { Alert, AlertDescription } from "./ui/alert";


function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isSubmitting} size="lg" className="w-full">
      {pending || isSubmitting ? (
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
  const [data, setData] = useState<PromptGeneratorOutput | undefined>(undefined);
  const [issues, setIssues] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const getIssueMessage = (path: string) => {
      return issues.find(issue => issue.path.includes(path))?.message;
  }

  const handleSubmit = async (formData: FormData) => {
      setIsSubmitting(true);
      setData(undefined);
      setIssues([]);
      const result = await generatePromptAction(formData);
      if(result.success) {
          setData(result.data);
      } else {
          if (result.issues) {
              setIssues(result.issues);
          } else {
              toast({
                  variant: "destructive",
                  title: "Error",
                  description: "An unknown error occurred."
              });
          }
      }
      setIsSubmitting(false);
  }
  
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
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার ধারণা থেকে প্রম্পট তৈরি করুন</CardTitle>
        <CardDescription>
          আপনার ধারণা বর্ণনা করুন বা একটি ছবি আপলোড করুন এবং এআই আপনার জন্য একটি বিস্তারিত প্রম্পট তৈরি করবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">আপনার ধারণা বা বিষয় (ঐচ্ছিক)</Label>
            <Textarea
              id="topic"
              name="topic"
              placeholder="যেমন, ঢাকার রাস্তায় একটি রিকশার ছবি, বৃষ্টির দিনে একটি বিড়ালের ভিডিও"
              rows={2}
            />
            {getIssueMessage('topic') && <p className="text-sm font-medium text-destructive">{getIssueMessage('topic')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">ছবি আপলোড করুন (ঐচ্ছিক)</Label>
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
                <div className="mt-2 relative w-full aspect-video border rounded-md">
                    <Image src={previewUrl} alt="Preview" fill className="rounded-md object-contain p-2"/>
                    <Button type="button" variant="destructive" size="icon" onClick={handleRemoveImage} className="absolute -top-2 -right-2 h-6 w-6 rounded-full">
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
             {getIssueMessage('photo') && <p className="text-sm font-medium text-destructive">{getIssueMessage('photo')}</p>}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>মিডিয়ার ধরন</Label>
                <RadioGroup name="mediaType" defaultValue="Image" className="flex gap-4 pt-2">
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
                 {getIssueMessage('mediaType') && <p className="text-sm font-medium text-destructive">{getIssueMessage('mediaType')}</p>}
            </div>
             <div className="space-y-2">
                <Label>প্রম্পটের ভাষা</Label>
                <RadioGroup name="language" defaultValue="Bengali" className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Bengali" id="bengali" />
                        <Label htmlFor="bengali">বাংলা</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="English" id="english" />
                        <Label htmlFor="english">English</Label>
                    </div>
                </RadioGroup>
                 {getIssueMessage('language') && <p className="text-sm font-medium text-destructive">{getIssueMessage('language')}</p>}
            </div>
          </div>
          
           {getIssueMessage('root') && <Alert variant="destructive"><AlertDescription>{getIssueMessage('root')}</AlertDescription></Alert>}

          <SubmitButton isSubmitting={isSubmitting} />
        </form>

        {isSubmitting && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার প্রম্পট তৈরি হচ্ছে...</p>
                </div>
            </div>
        )}

        {data && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড প্রম্পট</h3>
            <div className="space-y-6">
                <PromptList title="সংক্ষিপ্ত প্রম্পট" prompts={data.shortPrompts} />
                <PromptList title="বিস্তারিত প্রম্পট" prompts={data.longPrompts} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
