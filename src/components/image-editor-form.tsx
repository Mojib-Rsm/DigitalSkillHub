
"use client";

import React, { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { editImageAction } from "@/app/ai-tools/image-editor/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Palette, X, Image as ImageIcon, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { ImageEditorOutput } from "@/ai/flows/image-editor";
import { Alert, AlertDescription } from "./ui/alert";

function SubmitButton({isSubmitting}: {isSubmitting: boolean}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSubmitting;
  return (
    <Button type="submit" disabled={isDisabled} size="lg" className="w-full">
      {isDisabled ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          ছবি এডিট করা হচ্ছে...
        </>
      ) : (
        <>
          <Palette className="mr-2 h-5 w-5" />
          ছবি এডিট করুন
        </>
      )}
    </Button>
  );
}


export default function ImageEditorForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ImageEditorOutput | null>(null);
  const [issues, setIssues] = useState<Record<string, string[]>>({});
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setResult(null);
    setIssues({});
    try {
      const response = await editImageAction(formData);
      if (response.success && response.data) {
        setResult(response.data);
      } else if (response.issues) {
        const newIssues: Record<string, string[]> = {};
        response.issues.forEach(issue => {
            const path = issue.path[0] as string;
            if(!newIssues[path]) newIssues[path] = [];
            newIssues[path].push(issue.message);
        });
        setIssues(newIssues);
      }
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        setIssues({root: [errorMessage]});
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

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI ইমেজ এডিটর</CardTitle>
        <CardDescription>
          আপনার ছবি আপলোড করুন এবং টেক্সট প্রম্পট দিয়ে সম্পাদনা করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
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
                <div className="mt-2 relative w-full aspect-video border rounded-md">
                    <Image src={previewUrl} alt="Image preview" fill className="rounded-md object-contain p-2"/>
                    <Button type="button" variant="destructive" size="icon" onClick={handleRemoveImage} className="absolute -top-2 -right-2 h-6 w-6 rounded-full">
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            {issues.photo && <p className="text-sm font-medium text-destructive">{issues.photo[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">এডিট করার নির্দেশনা</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="যেমন, 'make this character into a robot', 'change the background to a jungle', 'add a superhero cape'"
              required
              rows={3}
            />
             {issues.prompt && <p className="text-sm font-medium text-destructive">{issues.prompt[0]}</p>}
          </div>
           {issues.root && (
                <Alert variant="destructive">
                    <AlertDescription>{issues.root[0]}</AlertDescription>
                </Alert>
            )}
          <SubmitButton isSubmitting={isSubmitting} />
        </form>

        {isSubmitting && (
            <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার ছবি এডিট করা হচ্ছে...</p>
                </div>
            </div>
        )}

        {result?.imageUrl && (
            <div className="mt-8">
                <h3 className="text-2xl font-bold font-headline mb-4 text-center">এডিট করা ছবি</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <p className="text-sm font-semibold text-center mb-2">আসল ছবি</p>
                        <Card className="bg-muted/50 overflow-hidden">
                           {previewUrl && <Image src={previewUrl} alt="Original image" width={512} height={512} className="w-full object-contain"/>}
                        </Card>
                    </div>
                     <div>
                         <p className="text-sm font-semibold text-center mb-2">এডিট করা ছবি</p>
                        <Card className="bg-muted/50 overflow-hidden">
                            <Image src={result.imageUrl} alt="Edited image" width={512} height={512} className="w-full object-contain"/>
                        </Card>
                    </div>
                </div>
                 <Button asChild className="w-full mt-4" size="lg">
                    <a href={result.imageUrl} download="edited-image.png">
                        <Download className="mr-2"/>
                        ডাউনলোড করুন
                    </a>
                </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
