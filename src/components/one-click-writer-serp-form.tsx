
"use client";

import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { getSerpAnalysisAction, generateArticleFromSerpAction } from "@/app/ai-tools/one-click-writer-serp/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { OneClickWriterSerpInput, type OneClickWriterSerpOutput } from "@/ai/schema/one-click-writer-serp";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";
import { Check, ChevronsUpDown } from "lucide-react";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'rehype-stringify';
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { SerpResult } from "@/services/serp-service";

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isSubmitting} size="lg" className="w-full">
      {pending || isSubmitting ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Analyzing SERP...
        </>
      ) : (
        <>
          <Search className="mr-2 h-5 w-5" />
          Analyze SERP & Generate Article
        </>
      )}
    </Button>
  );
}

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export default function OneClickWriterSerpForm() {
  const { toast } = useToast();
  const [data, setData] = useState<OneClickWriterSerpOutput | undefined>(undefined);
  const [serpResults, setSerpResults] = useState<SerpResult[]>([]);
  const [currentInput, setCurrentInput] = useState<OneClickWriterSerpInput | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState("");
  const [country, setCountry] = useState("United States");
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);

  useEffect(() => {
    if (data?.article) {
        markdownToHtml(data.article).then(setRenderedHtml);
    }
  }, [data]);
  
  useEffect(() => {
    if (serpResults.length > 0 && currentInput) {
        setIsAnalyzing(false);
        setIsWriting(true);
        const generate = async () => {
            const result = await generateArticleFromSerpAction(currentInput, serpResults);
            if (result.success && result.data) {
                setData(result.data);
            } else {
                setIssues(result.issues || ["An unknown error occurred."]);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.issues?.join(", ") || "An unknown error occurred.",
                });
            }
            setIsWriting(false);
        };
        generate();
    }
  }, [serpResults, currentInput, toast])

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({ title: "Copied to clipboard!" });
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
      setIsAnalyzing(true);
      setData(undefined);
      setSerpResults([]);
      setIssues([]);

      const formData = new FormData(event.currentTarget);
      const input = {
          title: formData.get('title') as string,
          primaryKeyword: formData.get('primaryKeyword') as string,
          language: formData.get('language') as 'Bengali' | 'English',
          tone: formData.get('tone') as 'Formal' | 'Casual' | 'Friendly' | 'Professional',
          targetCountry: formData.get('targetCountry') as string,
      };
      setCurrentInput(input);
      
      const result = await getSerpAnalysisAction(input);

      if (result.success && result.data) {
        setSerpResults(result.data);
      } else {
        setIssues(result.issues || ["An unknown error occurred."]);
        toast({
            variant: "destructive",
            title: "Error",
            description: result.issues?.join(", ") || "An unknown error occurred.",
        });
        setIsAnalyzing(false);
      }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>SERP-Informed Article Generation</CardTitle>
        <CardDescription>
          Provide a topic and keyword. The AI will analyze top Google results to create a superior, SEO-optimized article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Article Topic/Title</Label>
                <Input id="title" name="title" placeholder="e.g., How to Become a Successful Freelancer" required className="text-base" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                    <Input id="primaryKeyword" name="primaryKeyword" placeholder="e.g., successful freelancer tips" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tone">Tone of Voice</Label>
                    <Select name="tone" defaultValue="Professional">
                        <SelectTrigger id="tone"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Language</Label>
                    <Select name="language" defaultValue="English">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bengali">Bengali</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="country">Target Country</Label>
                    <input type="hidden" name="targetCountry" value={country} />
                    <Popover open={countrySelectOpen} onOpenChange={setCountrySelectOpen}>
                        <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={countrySelectOpen} className="w-full justify-between font-normal">
                            {country ? countries.find((c) => c.value === country)?.label : "Select country..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-y-auto">
                            {countries.map((c) => (
                                <CommandItem key={c.value} value={c.value} onSelect={(currentValue) => { setCountry(countries.find(c => c.value.toLowerCase() === currentValue.toLowerCase())?.value || ""); setCountrySelectOpen(false); }}>
                                <Check className={cn("mr-2 h-4 w-4", country === c.value ? "opacity-100" : "opacity-0")} />
                                {c.label}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          
            {issues.length > 0 && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5">
                            {issues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

          <SubmitButton isSubmitting={isAnalyzing || isWriting} />
        </form>

        {(isAnalyzing || isWriting) && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground font-semibold animate-pulse">{isAnalyzing ? "Analyzing Google SERP..." : "Writing your article..."}</p>
                    {isAnalyzing && (
                        <Carousel
                            plugins={[Autoplay({ delay: 2000 })]}
                            className="w-full max-w-xs mx-auto mt-4"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index} className="basis-1/3">
                                        <div className="p-1">
                                            <Card className="bg-background">
                                                <CardContent className="flex flex-col items-center justify-center p-2 gap-1 aspect-square">
                                                    <Search className="w-5 h-5 text-primary"/>
                                                    <span className="text-xs font-semibold text-muted-foreground">Analyzing...</span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    )}
                     {isWriting && serpResults.length > 0 && (
                        <Carousel
                            plugins={[Autoplay({ delay: 1500 })]}
                            className="w-full max-w-xs mx-auto mt-4"
                             opts={{ align: "start", loop: true, }}
                        >
                            <CarouselContent>
                                {serpResults.map((result, index) => (
                                    <CarouselItem key={index} className="basis-1/2">
                                        <div className="p-1">
                                            <Card className="bg-background">
                                                <CardContent className="flex flex-col items-center justify-center p-2 gap-1 text-center">
                                                    <img src={`https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}&sz=32`} alt="favicon" width={16} height={16} className="mb-1"/>
                                                    <span className="text-[10px] font-semibold text-muted-foreground truncate w-full">{new URL(result.link).hostname}</span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    )}
                    <p className="text-muted-foreground text-sm mt-2">This may take up to a minute. Please don't leave the page.</p>
                </div>
            </div>
        )}

        {data && !isAnalyzing && !isWriting && (
          <div className="mt-8 space-y-8">
            <h3 className="text-3xl font-bold font-headline text-center">Your Generated Article</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
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
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SEO & Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertTitle>SEO Title</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                        <p>{data.seoTitle}</p>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(data.seoTitle)}><Clipboard className="w-4 h-4"/></Button>
                        </AlertDescription>
                    </Alert>
                    <Alert>
                        <AlertTitle>Meta Description</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                        <p>{data.seoDescription}</p>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(data.seoDescription)}><Clipboard className="w-4 h-4"/></Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Full Article</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(data.article)}><Clipboard className="mr-2"/> Copy</Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2"/> Download (.md)</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-img:rounded-lg" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
