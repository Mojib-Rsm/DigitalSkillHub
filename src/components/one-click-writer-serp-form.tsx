
"use client";

import React, { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { getSerpAnalysisAction, generateArticleFromSerpAction } from "@/app/ai-tools/one-click-writer-serp/actions";
import type { SerpAnalysisResult } from "@/app/ai-tools/one-click-writer-serp/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, ExternalLink, Link as LinkIcon, CheckCircle, Tag, ChevronsUpDown, Check, TrendingUp, ImageIcon, Smile, BookOpen, Fingerprint, Share2, Search, BarChart, Users, HelpCircle, Loader, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";
import type { OneClickWriterOutput } from "@/ai/flows/one-click-writer";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

// Remark and rehype plugins for markdown rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';


function AnalyzeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Analyzing SERP...
        </>
      ) : (
        <>
          <Search className="mr-2 h-5 w-5" />
          Create
        </>
      )}
    </Button>
  );
}

function GenerateArticleButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Generating Article...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-5 w-5" />
          Generate Article
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


export default function OneClickWriterSerpForm() {
  const { toast } = useToast();
  const [issues, setIssues] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [serpData, setSerpData] = useState<SerpAnalysisResult | null>(null);
  const [country, setCountry] = useState("Bangladesh");
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [article, setArticle] = useState<OneClickWriterOutput | null>(null);
  const [renderedHtml, setRenderedHtml] = useState("");

  useEffect(() => {
    if (article?.article) {
        markdownToHtml(article.article).then(setRenderedHtml);
    }
  }, [article]);

  const handleAnalysis = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsAnalyzing(true);
      setSerpData(null);
      setIssues([]);

      const formData = new FormData(event.currentTarget);
      const result = await getSerpAnalysisAction(formData);

      if (result.success && result.data) {
        setSerpData(result.data);
        setPrimaryKeyword(formData.get('primaryKeyword') as string);
      } else {
        setIssues(result.issues || ["An unknown error occurred."]);
        toast({
            variant: "destructive",
            title: "Error",
            description: result.issues?.join(", ") || "An unknown error occurred.",
        });
      }
      setIsAnalyzing(false);
  }

  const handleGeneration = async (event: React.FormEvent<HTMLFormElement>) => {
       event.preventDefault();
       setIsGenerating(true);
       setArticle(null);
       setIssues([]);

       const formData = new FormData(event.currentTarget);
       const input = {
          title: formData.get('title') as string,
          primaryKeyword: primaryKeyword,
          targetCountry: country,
          tone: formData.get('tone') as string,
          audience: formData.get('audience') as string,
          purpose: formData.get('purpose') as string,
          outline: formData.get('outline') as string,
          customSource: formData.get('customSource') as string,
       };

       const result = await generateArticleFromSerpAction(input);

       if (result.success && result.data) {
            setArticle(result.data);
       } else {
           setIssues(result.issues || ["An unknown error occurred."]);
           toast({
               variant: "destructive",
               title: "Error",
               description: result.issues?.join(", ") || "An unknown error occurred.",
           });
       }
       setIsGenerating(false);
  }

  const generateInitialOutline = (data: SerpAnalysisResult) => {
    let outline = `Introduction: Briefly introduce ${primaryKeyword}.\n\n`;

    data.serpResults.slice(0, 3).forEach((result, index) => {
        outline += `H2: ${result.title}\n`;
        outline += ` - Key point from: ${result.snippet.substring(0, 50)}...\n\n`;
    });

    if (data.relatedQuestions.length > 0) {
        outline += `H2: Frequently Asked Questions\n`;
        data.relatedQuestions.slice(0, 3).forEach(q => {
            outline += ` - H3: ${q.question}\n`;
        });
        outline += `\n`;
    }

    outline += `Conclusion: Summarize the key points about ${primaryKeyword}.`;
    return outline;
  }

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "ক্লিপবোর্ডে কপি করা হয়েছে!",
    });
  };

  const handleDownload = () => {
    if (!article) return;
    const blob = new Blob([article.article], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${article.seoTitle.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (article) {
    return (
        <div className="space-y-8">
            <Button variant="outline" onClick={() => setArticle(null)}><ArrowLeft className="mr-2"/> Go Back & Edit</Button>
            <h3 className="text-3xl font-bold font-headline text-center">Your Generated Article</h3>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Fingerprint className="w-5 h-5 text-primary"/>SEO & Readability Analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ScoreCircle score={article.readability.score} text="Readability" interpretation={article.readability.interpretation} />
                     <div className="space-y-4">
                        <Alert>
                            <Smile className="h-4 w-4" />
                            <AlertTitle>Sentiment</AlertTitle>
                            <AlertDescription>{article.seoAnalysis.sentiment}</AlertDescription>
                        </Alert>
                         <Alert>
                            <BookOpen className="h-4 w-4" />
                            <AlertTitle>Word Count</AlertTitle>
                            <AlertDescription>{article.seoAnalysis.wordCount} words</AlertDescription>
                        </Alert>
                    </div>
                    <div className="lg:col-span-2">
                        <Alert>
                             <AlertTitle>LSI Keywords</AlertTitle>
                             <AlertDescription className="flex flex-wrap gap-2 pt-2">
                                 {article.seoAnalysis.lsiKeywords.map(keyword => <Badge key={keyword} variant="outline">{keyword}</Badge>)}
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/>Article & Meta Data</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(article.article)}><Clipboard className="mr-2"/> Copy Article</Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2"/> Download (.md)</Button>
                        <Button variant="default" size="sm"><Share2 className="mr-2"/> Publish</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <AlertTitle>SEO Title</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                        <p>{article.seoTitle}</p>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(article.seoTitle)}><Clipboard className="w-4 h-4"/></Button>
                        </AlertDescription>
                    </Alert>
                    <Alert>
                        <AlertTitle>Meta Description</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                        <p>{article.seoDescription}</p>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(article.seoDescription)}><Clipboard className="w-4 h-4"/></Button>
                        </AlertDescription>
                    </Alert>
                    <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-img:rounded-lg prose-img:border" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                </CardContent>
            </Card>
          </div>
    )
  }

  if (serpData) {
    return (
         <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setSerpData(null)}><ArrowLeft/></Button>
                    <div>
                        <CardTitle>Context & Outline</CardTitle>
                        <CardDescription>Refine the context and outline before generating the article.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleGeneration} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="title">Article Title</Label>
                             <Input id="title" name="title" defaultValue={primaryKeyword} required />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="purpose">Purpose of Article</Label>
                             <Input id="purpose" name="purpose" placeholder="e.g., Informational, Commercial, Review" required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="tone">Tone of Voice</Label>
                             <Input id="tone" name="tone" placeholder="e.g., Formal, Casual, Humorous" required />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="audience">Target Audience</Label>
                             <Input id="audience" name="audience" placeholder="e.g., Beginners, Experts, Students" required />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="outline">Content Brief / Outline</Label>
                        <Textarea id="outline" name="outline" rows={15} defaultValue={generateInitialOutline(serpData)} required/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="customSource">Custom Source / URL (Optional)</Label>
                        <Input id="customSource" name="customSource" placeholder="Enter a URL to include as a primary source" />
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
                    <GenerateArticleButton/>
                </form>
            </CardContent>
         </Card>
    )
  }

  return (
    <div>
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Keyword & Location</CardTitle>
                <CardDescription>
                    Enter your primary keyword and target country to begin SERP analysis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAnalysis} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="primaryKeyword">Keyword or Topic</Label>
                        <Input id="primaryKeyword" name="primaryKeyword" placeholder="e.g., best travel destinations in asia" required className="text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Target Country</Label>
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
                                : "Select country..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search country..." />
                                <CommandEmpty>No country found.</CommandEmpty>
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
                    <AnalyzeButton />
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
