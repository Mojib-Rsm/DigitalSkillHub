
"use client";

import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateArticleAction } from "@/app/ai-tools/ai-article-writer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, ExternalLink, Link as LinkIcon, CheckCircle, Tag, ChevronsUpDown, Check, TrendingUp, ImageIcon, Smile, Frown, Meh, BookOpen, Fingerprint, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { OneClickWriterOutput } from "@/ai/flows/one-click-writer";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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

const ScoreCircle = ({ score, text, interpretation }: { score: number, text: string, interpretation: string }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const strokeDashoffset = circumference - (score / 100) * circumference;
    let colorClass = 'text-green-500';
    if (score < 50) colorClass = 'text-red-500';
    else if (score < 80) colorClass = 'text-yellow-500';

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle
                        className="text-muted"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="52"
                        cx="60"
                        cy="60"
                    />
                    <circle
                        className={`transform -rotate-90 origin-center transition-all duration-1000 ${colorClass}`}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="52"
                        cx="60"
                        cy="60"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
                </div>
            </div>
            <p className="text-sm font-semibold">{text}</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">{interpretation}</p>
        </div>
    )
};


export default function AiArticleWriterForm() {
  const { toast } = useToast();
  const [data, setData] = useState<OneClickWriterOutput | undefined>(undefined);
  const [issues, setIssues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);

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
          contentLength: formData.get('contentLength') as 'Auto' | 'Short' | 'Medium' | 'Long' | 'Ultra Long',
          tone: formData.get('tone') as 'Formal' | 'Casual' | 'Friendly' | 'Professional',
          targetCountry: formData.get('targetCountry') as string,
          includeFaq: formData.get('includeFaq') === 'on',
          includeKeyTakeaways: formData.get('includeKeyTakeaways') === 'on',
          disableIntroduction: formData.get('disableIntroduction') === 'on',
          disableConclusion: formData.get('disableConclusion') === 'on',
          enableSkinnyParagraph: formData.get('enableSkinnyParagraph') === 'on',
          passAiDetection: formData.get('passAiDetection') === 'on',
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
            </div>
            
            <div className="space-y-2">
                <Label>Word Count</Label>
                <RadioGroup name="contentLength" defaultValue="Auto" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[
                        {value: "Auto", label: "Auto"},
                        {value: "Short", label: "Short (600-800)"},
                        {value: "Medium", label: "Medium (900-1,600)"},
                        {value: "Long", label: "Long (1,700-3,000)"},
                        {value: "Ultra Long", label: "Ultra Long (3,000-6,000)"},
                    ].map(option => (
                         <Label key={option.value} htmlFor={option.value} className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <span>{option.label}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="country">লক্ষ্য দেশ</Label>
                    <input type="hidden" name="targetCountry" value={country} />
                    <Popover open={countrySelectOpen} onOpenChange={setCountrySelectOpen}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countrySelectOpen}
                            className="w-full justify-between font-normal"
                        >
                            {country
                            ? countries.find((c) => c.value === country)?.label
                            : "দেশ নির্বাচন করুন..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="দেশ খুঁজুন..." />
                            <CommandEmpty>কোনো দেশ পাওয়া যায়নি।</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-y-auto">
                            {countries.map((c) => (
                                <CommandItem
                                key={c.value}
                                value={c.value}
                                onSelect={(currentValue) => {
                                    setCountry(countries.find(c => c.value.toLowerCase() === currentValue.toLowerCase())?.value || "")
                                    setCountrySelectOpen(false)
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    country === c.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {c.label}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <Card className="p-4 bg-muted/50">
                    <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-lg">Content Structure Options</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="includeFaq" className="font-normal">Include FAQ Section</Label>
                            <Switch id="includeFaq" name="includeFaq" />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="includeKeyTakeaways" className="font-normal">Include Key Takeaways</Label>
                            <Switch id="includeKeyTakeaways" name="includeKeyTakeaways" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="disableIntroduction" className="font-normal">Disable Introduction</Label>
                            <Switch id="disableIntroduction" name="disableIntroduction" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="disableConclusion" className="font-normal">Disable Conclusion</Label>
                            <Switch id="disableConclusion" name="disableConclusion" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="enableSkinnyParagraph" className="font-normal">Enable Skinny Paragraph</Label>
                            <Switch id="enableSkinnyParagraph" name="enableSkinnyParagraph" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="passAiDetection" className="font-normal">Pass AI Detection</Label>
                                <p className="text-xs text-muted-foreground">Avoid common AI-detectable words and phrases</p>
                            </div>
                            <Switch id="passAiDetection" name="passAiDetection" />
                        </div>
                    </CardContent>
                </Card>
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
          <div className="mt-8 space-y-8">
            <h3 className="text-3xl font-bold font-headline text-center">আপনার জেনারেটেড আর্টিকেল</h3>
            
            {/* Featured Image Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary"/>ফিচার্ড ইমেজ</CardTitle>
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

            {/* Premium SEO & Readability Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Fingerprint className="w-5 h-5 text-primary"/>Premium SEO & Readability Analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ScoreCircle score={data.readability.score} text="Readability" interpretation={data.readability.interpretation} />
                    <div className="space-y-4">
                        <Alert>
                            <Smile className="h-4 w-4" />
                            <AlertTitle>Sentiment</AlertTitle>
                            <AlertDescription>{data.seoAnalysis.sentiment}</AlertDescription>
                        </Alert>
                         <Alert>
                            <BookOpen className="h-4 w-4" />
                            <AlertTitle>Word Count</AlertTitle>
                            <AlertDescription>{data.seoAnalysis.wordCount} words</AlertDescription>
                        </Alert>
                         <Alert>
                            <TrendingUp className="h-4 w-4" />
                            <AlertTitle>Flesch-Kincaid Grade</AlertTitle>
                            <AlertDescription>{data.readability.gradeLevel}</AlertDescription>
                        </Alert>
                    </div>
                    <div className="lg:col-span-2">
                        <Alert>
                             <AlertTitle>LSI Keywords</AlertTitle>
                             <AlertDescription className="flex flex-wrap gap-2 pt-2">
                                 {data.seoAnalysis.lsiKeywords.map(keyword => <Badge key={keyword} variant="outline">{keyword}</Badge>)}
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>

             {/* SEO & Meta Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/>এসইও ও মেটা তথ্য</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>টার্গেট কীওয়ার্ড</AlertTitle>
                        <AlertDescription>
                            প্রধান কীওয়ার্ড: <strong>"{data.targetKeyword}"</strong> সঠিকভাবে ব্যবহার করা হয়েছে।
                        </AlertDescription>
                    </Alert>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Alert>
                             <div className="flex justify-between items-center mb-2">
                                <AlertTitle className="flex items-center gap-2"><Tag className="w-4 h-4"/>Suggested Categories</AlertTitle>
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(data.suggestedCategories.join(', '))}><Clipboard className="w-4 h-4 mr-2"/>Copy</Button>
                            </div>
                            <AlertDescription className="flex flex-wrap gap-2 pt-2">
                                {data.suggestedCategories.map((category) => <Badge key={category} variant="secondary">{category}</Badge>)}
                            </AlertDescription>
                        </Alert>
                            <Alert>
                             <div className="flex justify-between items-center mb-2">
                                <AlertTitle className="flex items-center gap-2"><Tag className="w-4 h-4"/>Suggested Tags</AlertTitle>
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(data.suggestedTags.join(', '))}><Clipboard className="w-4 h-4 mr-2"/>Copy</Button>
                            </div>
                            <AlertDescription className="flex flex-wrap gap-2 pt-2">
                                {data.suggestedTags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                            </AlertDescription>
                        </Alert>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                </CardContent>
            </Card>
            
            {/* Article Section */}
            <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/>সম্পূর্ণ আর্টিকেল</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(data.article)}><Clipboard className="mr-2"/> কপি করুন</Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2"/> ডাউনলোড (.md)</Button>
                        <Button variant="default" size="sm"><Share2 className="mr-2"/> Publish to WordPress</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-img:rounded-lg prose-img:border" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                </CardContent>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
