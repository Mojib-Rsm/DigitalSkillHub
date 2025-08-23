
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateArticleAction } from "@/app/ai-tools/one-click-writer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, ExternalLink, Link as LinkIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import type { OneClickWriterOutput } from "@/ai/flows/one-click-writer";

// Remark and rehype plugins for markdown rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';


function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isSubmitting} size="lg" className="w-full">
      {pending || isSubmitting ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          আর্টিকেল তৈরি করা হচ্ছে...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-5 w-5" />
          আর্টিকেল তৈরি করুন
        </>
      )}
    </Button>
  );
}

// Function to convert markdown to HTML
async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}


export default function OneClickWriterForm() {
  const { toast } = useToast();
  const [data, setData] = useState<OneClickWriterOutput | undefined>(undefined);
  const [issues, setIssues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState("");

  useEffect(() => {
    if (data?.article) {
        markdownToHtml(data.article).then(setRenderedHtml);
    }
  }, [data]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "ক্লিপবোর্ডে কপি করা হয়েছে!",
    });
  };
  
  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([data.article], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${data.seoTitle.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setData(undefined);
      setIssues([]);

      const formData = new FormData(event.currentTarget);
      const input = {
          title: formData.get('title') as string,
          primaryKeyword: formData.get('primaryKeyword') as string,
          contentLength: formData.get('contentLength') as 'Short' | 'Medium' | 'Long',
          tone: formData.get('tone') as 'Formal' | 'Casual' | 'Friendly' | 'Professional',
      };
      
      const result = await generateArticleAction(input);

      if (result.success) {
        setData(result.data);
      } else {
        setIssues(result.issues || ["An unknown error occurred."]);
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: result.issues?.join(", ") || "একটি অজানা ত্রুটি ঘটেছে।",
        });
      }
      setIsSubmitting(false);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আর্টিকেল তৈরির ইনপুট সেকশন</CardTitle>
        <CardDescription>
          আপনার আর্টিকেলের জন্য প্রয়োজনীয় তথ্য দিন এবং এআই বাকিটা করবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">আর্টিকেলের শিরোনাম/বিষয়</Label>
                <Input id="title" name="title" placeholder="যেমন, কীভাবে একজন সফল ফ্রিল্যান্সার হওয়া যায়" required className="text-base" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="primaryKeyword">প্রধান কীওয়ার্ড</Label>
                    <Input id="primaryKeyword" name="primaryKeyword" placeholder="যেমন, ফ্রিল্যান্সিং টিপস" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contentLength">আর্টিকেলের দৈর্ঘ্য</Label>
                    <Select name="contentLength" defaultValue="Medium">
                        <SelectTrigger id="contentLength">
                            <SelectValue placeholder="দৈর্ঘ্য নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Short">ছোট (প্রায় ৪০০ শব্দ)</SelectItem>
                            <SelectItem value="Medium">মাঝারি (প্রায় ৮০০ শব্দ)</SelectItem>
                            <SelectItem value="Long">বড় (প্রায় ১৫০০ শব্দ)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="tone">লেখার ধরণ/টোন</Label>
                <Select name="tone" defaultValue="Friendly">
                    <SelectTrigger id="tone">
                        <SelectValue placeholder="টোন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Formal">ফরমাল</SelectItem>
                        <SelectItem value="Casual">সাধারণ</SelectItem>
                        <SelectItem value="Friendly">বন্ধুসুলভ</SelectItem>
                        <SelectItem value="Professional">পেশাদার</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          
            {issues.length > 0 && (
                <Alert variant="destructive">
                    <AlertTitle>ত্রুটি</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5">
                            {issues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

          <SubmitButton isSubmitting={isSubmitting} />
        </form>

        {(isSubmitting) && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground font-semibold animate-pulse">আপনার আর্টিকেল তৈরি হচ্ছে...</p>
                    <p className="text-muted-foreground text-sm">এই প্রক্রিয়াটি এক মিনিট পর্যন্ত সময় নিতে পারে। দয়া করে পৃষ্ঠাটি ত্যাগ করবেন না।</p>
                </div>
            </div>
        )}

        {data && !isSubmitting &&(
          <div className="mt-8 space-y-6">
            <h3 className="text-3xl font-bold font-headline text-center">আপনার জেনারেটেড আর্টিকেল</h3>
            
            <Tabs defaultValue="article" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="article">আর্টিকেল</TabsTrigger>
                    <TabsTrigger value="image">ফিচার্ড ইমেজ</TabsTrigger>
                    <TabsTrigger value="seo">এসইও</TabsTrigger>
                    <TabsTrigger value="analysis">বিশ্লেষণ</TabsTrigger>
                </TabsList>
                <TabsContent value="article" className="mt-4">
                     <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>আর্টিকেল কনটেন্ট</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleCopy(data.article)}><Clipboard className="mr-2"/> কপি করুন</Button>
                                <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2"/> ডাউনলোড (.md)</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="image" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>ফিচার্ড ইমেজ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image src={data.featuredImageUrl} alt={data.altText} width={1024} height={576} className="rounded-lg border object-contain w-full"/>
                             <Alert className="mt-4">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Alt Text</AlertTitle>
                                <AlertDescription className="flex justify-between items-center">
                                    <p className="italic">{data.altText}</p>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopy(data.altText)}><Clipboard className="w-4 h-4"/></Button>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter>
                            <a href={data.featuredImageUrl} download={`${data.seoTitle.replace(/\s+/g, '_')}_featured_image.png`}>
                                <Button variant="outline"><Download className="mr-2"/> ইমেজ ডাউনলোড করুন</Button>
                            </a>
                        </CardFooter>
                    </Card>
                </TabsContent>
                 <TabsContent value="seo" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>এসইও ও মেটা তথ্য</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <AlertTitle>এসইও টাইটেল</AlertTitle>
                                <AlertDescription className="flex justify-between items-center">
                                <p>{data.seoTitle}</p>
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(data.seoTitle)}><Clipboard className="w-4 h-4"/></Button>
                                </AlertDescription>
                            </Alert>
                            <Alert>
                                <AlertTitle>মেটা ডেসক্রিপশন</AlertTitle>
                                <AlertDescription className="flex justify-between items-center">
                                <p>{data.seoDescription}</p>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopy(data.seoDescription)}><Clipboard className="w-4 h-4"/></Button>
                                </AlertDescription>
                            </Alert>
                             <Alert>
                                <AlertTitle>অভ্যন্তরীণ লিঙ্কিং পরামর্শ</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                    {data.internalLinks.map((link, i) => <li key={i}>{link}</li>)}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                            <Alert>
                                <AlertTitle>বহিরাগত লিঙ্কিং পরামর্শ</AlertTitle>
                                <AlertDescription>
                                     <ul className="list-disc pl-5 mt-2 space-y-1">
                                    {data.externalLinks.map((link, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span>{link}</span>
                                            <a href={`https://www.google.com/search?q=${link}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3 h-3 text-primary"/></a>
                                        </li>
                                    ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="analysis" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>কনটেন্ট বিশ্লেষণ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <Label>পড়ার যোগ্যতা (Readability)</Label>
                                    <span className="font-bold">{data.readabilityScore}/10</span>
                                </div>
                                <Progress value={data.readabilityScore * 10} className="w-full" />
                            </div>
                             <Alert>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle>পড়ার যোগ্যতা বিশ্লেষণ</AlertTitle>
                                <AlertDescription>
                                  আপনার আর্টিকেলের স্কোর হলো <strong>{data.readabilityScore}/10</strong>। এটি পড়তে সহজ এবং বোঝা সহজ। উচ্চ স্কোর মানে পাঠকরা আপনার লেখা সহজেই বুঝতে পারবেন।
                                </AlertDescription>
                            </Alert>
                             <Alert>
                                <LinkIcon className="h-4 w-4" />
                                <AlertTitle>টার্গেট কীওয়ার্ড</AlertTitle>
                                <AlertDescription>
                                 আপনার দেওয়া প্রধান কীওয়ার্ড হলো: <strong>"{data.targetKeyword}"</strong>। এটি আর্টিকেলে সঠিকভাবে ব্যবহার করা হয়েছে।
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
