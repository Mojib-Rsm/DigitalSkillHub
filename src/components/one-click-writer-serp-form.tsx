
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFormStatus } from "react-dom";
import { getSerpAnalysisAction, generateArticleFromSerpAction, getKeywordSuggestionsAction } from "@/app/ai-tools/one-click-writer-serp/actions";
import type { SerpAnalysisResult } from "@/app/ai-tools/one-click-writer-serp/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, ExternalLink, Link as LinkIcon, CheckCircle, Tag, ChevronsUpDown, Check, TrendingUp, ImageIcon, Smile, BookOpen, Fingerprint, Share2, Search, BarChart, Users, HelpCircle, Loader, ArrowLeft, Youtube, Briefcase, Eye, X, Filter, ArrowUpDown } from "lucide-react";
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
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useDebounce } from 'use-debounce';


// Remark and rehype plugins for markdown rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';


function AnalyzeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="h-12 w-full md:w-auto">
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

const ScoreCircle = ({ score, text }: { score: number, text: string }) => {
    const circumference = 2 * Math.PI * 28; // 2 * pi * radius
    const strokeDashoffset = circumference - (score / 100) * circumference;
    let colorClass = 'text-green-500';
    if (score < 50) colorClass = 'text-red-500';
    else if (score < 80) colorClass = 'text-yellow-500';

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 64 64">
                    <circle
                        className="text-muted"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                    />
                    <circle
                        className={`transform -rotate-90 origin-center transition-all duration-1000 ${colorClass}`}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${colorClass}`}>{score}</span>
                </div>
            </div>
            <p className="text-xs font-semibold">{text}</p>
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
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  
  const [debouncedKeyword] = useDebounce(primaryKeyword, 500);
  const [article, setArticle] = useState<OneClickWriterOutput | null>(null);
  const [renderedHtml, setRenderedHtml] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initialOutline, setInitialOutline] = useState("");
  const outlineRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    if (article?.article) {
        markdownToHtml(article.article).then(setRenderedHtml);
    }
  }, [article]);

  useEffect(() => {
      const fetchSuggestions = async () => {
          if (debouncedKeyword.length > 2) {
              setSuggestionsLoading(true);
              const result = await getKeywordSuggestionsAction(debouncedKeyword);
              setSuggestions(result);
              setSuggestionsLoading(false);
          } else {
              setSuggestions([]);
          }
      };
      fetchSuggestions();
  }, [debouncedKeyword]);


  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPrimaryKeyword(value);
  }

  const handleSuggestionClick = (suggestion: string) => {
      setPrimaryKeyword(suggestion);
      setShowSuggestions(false);
  }

  const handleSecondaryKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === 'Enter' || e.key === ',') && e.currentTarget.value.trim()) {
          e.preventDefault();
          const newKeywords = e.currentTarget.value.split(',').map(k => k.trim()).filter(Boolean);
          setSecondaryKeywords([...secondaryKeywords, ...newKeywords]);
          e.currentTarget.value = "";
      }
  }

  const removeSecondaryKeyword = (index: number) => {
      setSecondaryKeywords(secondaryKeywords.filter((_, i) => i !== index));
  }


  const handleAnalysis = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsAnalyzing(true);
      setSerpData(null);
      setIssues([]);

      const formData = new FormData(event.currentTarget);
      formData.delete('primaryKeyword'); // remove default from form
      formData.append('primaryKeyword', primaryKeyword);
      secondaryKeywords.forEach(kw => formData.append('secondaryKeywords[]', kw));

      const result = await getSerpAnalysisAction(formData);

      if (result.success && result.data) {
        setSerpData(result.data);
        generateInitialOutline(result.data);
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
    setInitialOutline(outline);
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

  const handleUseQuestion = (question: string) => {
      if(outlineRef.current) {
          outlineRef.current.value += `\n\nH2: ${question}\n - Write a detailed answer for this question.`;
          toast({ title: "Question added to outline!" });
      }
  }

  // Final Editor View
  if (article) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                 <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Editor</CardTitle>
                        <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={() => handleCopy(article.article)}><Clipboard className="mr-2"/> Copy</Button>
                            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2"/> Download</Button>
                            <Button variant="default" size="sm"><Share2 className="mr-2"/> Publish</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-img:rounded-lg prose-img:border" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                    </CardContent>
                </Card>
            </div>
             <div className="space-y-4 sticky top-4 self-start">
                 <Card>
                    <CardHeader>
                        <CardTitle>SEO Score</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-around items-center">
                       <ScoreCircle score={article.readability.score} text="Readability" />
                       <ScoreCircle score={85} text="SEO Score" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Meta Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <div className="space-y-1">
                            <Label>Meta Title</Label>
                            <Textarea defaultValue={article.seoTitle} rows={2} />
                        </div>
                        <div className="space-y-1">
                            <Label>Meta Description</Label>
                            <Textarea defaultValue={article.seoDescription} rows={3} />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Internal Link Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {article.internalLinks.map(link => <li key={link}>{link}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  // Content Brief/Outline View
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleGeneration} className="space-y-6">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Content Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                        <Label htmlFor="customSource">Custom Source / URL (Optional)</Label>
                                        <Input id="customSource" name="customSource" placeholder="Enter a URL to include as a primary source" />
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content Brief / Outline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <Textarea ref={outlineRef} id="outline" name="outline" rows={15} defaultValue={initialOutline} required/>
                                </CardContent>
                            </Card>
                            
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
                    </div>
                     <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><BarChart className="w-4 h-4"/> Top 10 SERP Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <ScrollArea className="h-64">
                                    <div className="space-y-3">
                                    {serpData.serpResults.map((result, i) => (
                                        <div key={i}>
                                            <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">{result.title}</a>
                                            <p className="text-xs text-muted-foreground">{result.snippet}</p>
                                        </div>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Related Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-48">
                                    <div className="space-y-3">
                                    {serpData.relatedQuestions.map((q, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handleUseQuestion(q.question)}><PlusCircle className="w-4 h-4"/></Button>
                                            <p className="text-sm text-muted-foreground">{q.question}</p>
                                        </div>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                     </div>
                </div>
            </CardContent>
         </Card>
    )
  }

    // Initial View: Keyword & GEO
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>AI-Powered Article Writer</CardTitle>
                <CardDescription>Research and create GEO optimized top ranking articles.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAnalysis}>
                    <Card className="bg-muted/50">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                            <Input
                                id="primaryKeyword"
                                name="primaryKeyword"
                                placeholder="Enter Keyword(s)"
                                required
                                className="text-base h-12 flex-grow"
                                value={primaryKeyword}
                                onChange={handleKeywordChange}
                                autoComplete="off"
                            />
                            <div className="flex w-full md:w-auto gap-4">
                                <Select name="top" defaultValue="top-10">
                                    <SelectTrigger className="w-full md:w-[120px] h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="top-10">Top 10</SelectItem>
                                        <SelectItem value="top-20">Top 20</SelectItem>
                                        <SelectItem value="top-50">Top 50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="targetCountry" value={country} />
                                <Popover open={countrySelectOpen} onOpenChange={setCountrySelectOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={countrySelectOpen}
                                        className="w-full md:w-[180px] justify-between font-normal h-12"
                                    >
                                        {country
                                        ? countries.find((c) => c.value === country)?.label
                                        : "Select country..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[180px] p-0">
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
                             <AnalyzeButton/>
                        </CardContent>
                    </Card>
                </form>

                 <Separator className="my-6"/>
                 <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <Input placeholder="Search Articles" className="h-9 max-w-sm"/>
                        <div className="flex items-center gap-2">
                           <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4"/> Filter By</Button>
                           <Button variant="outline" size="sm"><ArrowUpDown className="mr-2 h-4 w-4"/> Sort By: Created At</Button>
                        </div>
                     </div>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Keyword(s)</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Word Count</TableHead>
                                <TableHead>Content Score</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    <p>bangladesh politics</p>
                                    <Badge variant="secondary">Bangladesh</Badge>
                                </TableCell>
                                <TableCell>1 day ago</TableCell>
                                <TableCell>0 Words</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell><Badge variant="outline" className="text-blue-600 border-blue-600">Writing in progress</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    <p>bangladesh politics (+1 more)</p>
                                    <Badge variant="secondary">Bangladesh</Badge>
                                </TableCell>
                                <TableCell>1 day ago</TableCell>
                                <TableCell>0 Words</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell><Badge variant="outline" className="text-blue-600 border-blue-600">Writing in progress</Badge></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">
                                    <p>BLood donate</p>
                                    <Badge variant="secondary">United States</Badge>
                                </TableCell>
                                <TableCell>1 day ago</TableCell>
                                <TableCell>1480 Words</TableCell>
                                <TableCell><Badge>86</Badge></TableCell>
                                <TableCell><Badge variant="outline" className="text-orange-600 border-orange-600">Editing in progress</Badge></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
        </Card>
    );
}
