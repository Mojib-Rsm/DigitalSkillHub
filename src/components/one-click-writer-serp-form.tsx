

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFormStatus } from "react-dom";
import { getSerpAnalysisAction, generateArticleFromSerpAction, getKeywordSuggestionsAction } from "@/app/ai-tools/one-click-writer-serp/actions";
import type { SerpAnalysisResult } from "@/app/ai-tools/one-click-writer-serp/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, ExternalLink, Link as LinkIcon, CheckCircle, Tag, ChevronsUpDown, Check, TrendingUp, ImageIcon, Smile, BookOpen, Fingerprint, Share2, Search, BarChart, Users, HelpCircle, Loader, ArrowLeft, Youtube, Briefcase, Eye, X, Filter, ArrowUpDown, ChevronRight, PlayCircle, Settings, File, Wand, ListChecks, RefreshCw, Trash2, GripVertical, FileQuestion, MessageSquare as MessageSquareIcon, ThumbsUp, BrainCircuit, BarChartHorizontal, PlusCircle } from "lucide-react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useDebounce } from 'use-debounce';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import ArticleEditor from "./article-editor";


// Remark and rehype plugins for markdown rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

type OutlineItem = {
  id: number;
  level: 'H2' | 'H3';
  text: string;
};


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

// Function to convert markdown to HTML
async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ["Context", "Title", "Outline", "First Draft"];
    return (
        <div className="flex items-center gap-2">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                            index + 1 < currentStep ? "bg-primary text-primary-foreground" : 
                            index + 1 === currentStep ? "border-2 border-primary text-primary" :
                            "bg-muted text-muted-foreground"
                        )}>
                            {index + 1 < currentStep ? <Check className="w-5 h-5"/> : index + 1}
                        </div>
                        <span className={cn(
                             "font-semibold",
                             index + 1 === currentStep ? "text-primary" : "text-muted-foreground"
                        )}>{step}</span>
                    </div>
                    {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </React.Fragment>
            ))}
        </div>
    );
};

const ProgressCircle = ({ progress }: { progress: number }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                    className="text-muted/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-primary transition-all duration-500"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
        </div>
    );
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
  
  const [currentStep, setCurrentStep] = useState(1);
  const [blogTitle, setBlogTitle] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);

  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([]);
  const [showRankedOutlines, setShowRankedOutlines] = useState(false);


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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
        setGenerationProgress(0);
        interval = setInterval(() => {
            setGenerationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    return 100;
                }
                return Math.min(100, prev + Math.random() * 10);
            });
        }, 300);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);


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
      formData.delete('primaryKeyword');
      formData.append('primaryKeyword', primaryKeyword);
      secondaryKeywords.forEach(kw => formData.append('secondaryKeywords[]', kw));

      const result = await getSerpAnalysisAction(formData);

      if (result.success && result.data) {
        setSerpData(result.data);
        if (result.data.serpResults.length > 0) {
            setBlogTitle(result.data.serpResults[0].title);
        } else {
            setBlogTitle(`A Creative Blog Post about ${primaryKeyword}`);
        }
        setCurrentStep(2);
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
  
  const handleResume = async (keyword: string, geo: string) => {
        // This is a simplified resume. A real app would fetch the saved state.
        const formData = new FormData();
        formData.append('primaryKeyword', keyword);
        formData.append('targetCountry', geo);
        
        // Mocking an event object for handleAnalysis
        const mockEvent = {
            preventDefault: () => {},
            currentTarget: {
                ...document.createElement('form'),
                ...{
                    elements: {
                        primaryKeyword: { value: keyword },
                        targetCountry: { value: geo }
                    }
                }
            },
            target: new EventTarget()
        } as unknown as React.FormEvent<HTMLFormElement>;
        
        await handleAnalysis(mockEvent);
    }

  const handleCreateOutline = () => {
      // Create a mock outline based on the title
      const newOutline: OutlineItem[] = [
          { id: Date.now() + 1, level: 'H2', text: 'Introduction' },
          { id: Date.now() + 2, level: 'H2', text: `Understanding ${primaryKeyword}` },
          { id: Date.now() + 3, level: 'H3', text: 'Key Aspect 1' },
          { id: Date.now() + 4, level: 'H3', text: 'Key Aspect 2' },
          { id: Date.now() + 5, level: 'H2', text: 'Conclusion' },
          { id: Date.now() + 6, level: 'H2', text: 'Frequently Asked Questions' },
      ];
      setOutlineItems(newOutline);
      setCurrentStep(3);
  }
  
  const addOutlineItem = () => {
      setOutlineItems([...outlineItems, { id: Date.now(), level: 'H2', text: '' }]);
  }
  
  const removeOutlineItem = (id: number) => {
      setOutlineItems(outlineItems.filter(item => item.id !== id));
  }

  const handleOutlineTextChange = (id: number, text: string) => {
      setOutlineItems(outlineItems.map(item => item.id === id ? { ...item, text } : item));
  }

  const handleOutlineLevelChange = (id: number, level: 'H2' | 'H3') => {
      setOutlineItems(outlineItems.map(item => item.id === id ? { ...item, level } : item));
  }


  const handleGenerateContent = async () => {
      setIsGenerating(true);
      setIssues([]);

      const input = {
        title: blogTitle,
        primaryKeyword: primaryKeyword,
        targetCountry: country,
        tone: "Friendly",
        audience: "General",
        purpose: "Informational",
        outline: outlineItems.map(item => `${"#".repeat(parseInt(item.level.substring(1)))} ${item.text}`).join('\n'),
      };
      
      const result = await generateArticleFromSerpAction(input);

      if (result.success && result.data) {
            setArticle(result.data);
            setCurrentStep(4);
      } else {
          setIssues(result.issues || ["An unknown error occurred."]);
          toast({
              variant: "destructive",
              title: "Error",
              description: result.issues?.join(", ") || "An unknown error occurred.",
          });
          setIsGenerating(false);
      }
  };

  const handleExportToEditor = () => {
      setCurrentStep(5);
  };


  const AnalysisProgressRow = () => (
    <TableRow className="bg-muted/50">
        <TableCell className="font-medium">
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground"/>
                <span>{primaryKeyword}</span>
            </div>
            {secondaryKeywords.length > 0 && <Badge variant="secondary" className="mt-1">+{secondaryKeywords.length} more</Badge>}
        </TableCell>
        <TableCell colSpan={3}>
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border-2 border-primary">
                    <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
                </div>
                 <div className="flex-1 h-1 bg-border rounded-full relative">
                    <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full">
                       {[...Array(5)].map((_, i) => (
                           <div key={i} className="h-2 w-2 rounded-full bg-border"></div>
                       ))}
                    </div>
                </div>
            </div>
        </TableCell>
         <TableCell>
             <div className="flex items-center gap-2">
                 <div>
                    <p className="font-semibold text-sm">Generating Competition Overview</p>
                    <p className="text-xs text-muted-foreground">Use this section to determine the ideal no. of words, H-tags, Images, etc.</p>
                 </div>
                 <Sparkles className="w-4 h-4 text-primary animate-spin"/>
            </div>
        </TableCell>
    </TableRow>
  )

  // Wrapper for all steps
  const renderContentByStep = () => {
      switch (currentStep) {
          case 2: // Title Selection
              return (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold">Enter the Blog Title (H1) <span className="text-destructive">*</span></h2>
                        <Textarea 
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            rows={3}
                            placeholder="Enter your blog title..."
                            className="text-lg"
                        />
                        <p className="text-sm text-muted-foreground">To proceed, click on Create Outline from the bottom bar</p>
                    </div>
                    <div className="lg:border-l lg:pl-6">
                        <Tabs defaultValue="top-ranked">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="ai-generated">AI Generated</TabsTrigger>
                                <TabsTrigger value="top-ranked">Top Ranked</TabsTrigger>
                            </TabsList>
                            <TabsContent value="ai-generated">
                                <p className="p-4 text-center text-muted-foreground">AI title generation coming soon.</p>
                            </TabsContent>
                            <TabsContent value="top-ranked">
                                <ScrollArea className="h-72">
                                    <div className="space-y-2 mt-4">
                                    {serpData?.serpResults.slice(0, 10).map((result, i) => (
                                        <button 
                                            key={i} 
                                            className="w-full text-left p-3 rounded-md hover:bg-muted"
                                            onClick={() => setBlogTitle(result.title)}
                                        >
                                            <p className="font-semibold text-sm text-primary">#{i + 1}</p>
                                            <p className="text-sm">{result.title}</p>
                                        </button>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
                     <div className="lg:col-span-3 flex justify-between p-0 pt-6 border-t mt-auto">
                        <Button variant="outline" onClick={() => setCurrentStep(1)}>
                            <ArrowLeft className="mr-2"/> Previous
                        </Button>
                         <Button onClick={handleCreateOutline}>
                            Create Outline <ChevronRight className="ml-2"/>
                        </Button>
                    </div>
                </div>
              );
          case 3: // Outline Builder
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    <div className="lg:col-span-2 space-y-4">
                         <Card>
                             <CardHeader className="flex flex-row justify-between items-center">
                                 <CardTitle className="text-lg">Outline Editor</CardTitle>
                                 <div className="flex items-center gap-2">
                                     <Switch id="highlight-terms" />
                                     <Label htmlFor="highlight-terms" className="text-sm font-normal">Highlight Key Terms</Label>
                                     <Button size="icon" variant="ghost"><RefreshCw className="w-4 h-4"/></Button>
                                     <Button size="icon" variant="ghost"><Download className="w-4 h-4"/></Button>
                                     <Button size="icon" variant="ghost" onClick={() => setOutlineItems([])}><Trash2 className="w-4 h-4"/></Button>
                                 </div>
                             </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    {outlineItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/50">
                                            <GripVertical className="cursor-move text-muted-foreground" />
                                             <Select value={item.level} onValueChange={(value: 'H2' | 'H3') => handleOutlineLevelChange(item.id, value)}>
                                                <SelectTrigger className="w-20 h-7 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="H2">H2</SelectItem>
                                                    <SelectItem value="H3">H3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                value={item.text} 
                                                className="h-7 text-sm border-none focus-visible:ring-1 focus-visible:ring-ring"
                                                onChange={(e) => handleOutlineTextChange(item.id, e.target.value)}
                                            />
                                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeOutlineItem(item.id)}>
                                                <X className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                     <Button type="button" variant="outline" size="sm" className="w-full mt-2" onClick={addOutlineItem}>
                                        <PlusCircle className="w-4 h-4 mr-2"/>
                                        Add Outline Item
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-6 lg:border-l lg:pl-6">
                        {showRankedOutlines ? (
                            <Tabs defaultValue="outlines">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="outlines">Outlines</TabsTrigger>
                                    <TabsTrigger value="questions">Questions</TabsTrigger>
                                    <TabsTrigger value="gaps">Gaps/Gains</TabsTrigger>
                                </TabsList>
                                <TabsContent value="outlines">
                                    <ScrollArea className="h-96">
                                        <p className="text-muted-foreground text-center p-4">Top ranked outlines will appear here.</p>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="questions">
                                     <div className="space-y-2">
                                        <div className="flex items-center gap-2 border-b pb-2">
                                            <Search className="w-4 h-4 text-muted-foreground"/>
                                            <Input placeholder="Search Questions..." className="border-none h-8"/>
                                            <Button variant="ghost" size="icon"><Youtube className="w-5 h-5 text-red-500"/></Button>
                                            <Button variant="ghost" size="icon"><MessageSquareIcon className="w-5 h-5 text-blue-500"/></Button>
                                            <Button variant="ghost" size="icon"><ThumbsUp className="w-5 h-5 text-green-500"/></Button>
                                        </div>
                                        <ScrollArea className="h-80">
                                            <p className="text-muted-foreground text-center p-4">Related questions will appear here.</p>
                                        </ScrollArea>
                                     </div>
                                </TabsContent>
                                <TabsContent value="gaps">
                                    <p className="text-muted-foreground text-center p-4">Content gaps will appear here.</p>
                                </TabsContent>
                            </Tabs>
                        ) : (
                             <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-muted/50 mt-4">
                               <p className="text-muted-foreground font-semibold">To Explore the Top Ranking Outlines</p>
                               <Button variant="outline" className="mt-2" onClick={() => setShowRankedOutlines(true)}>
                                   <Search className="w-4 h-4 mr-2"/> Click here
                               </Button>
                            </div>
                        )}
                    </div>
                     <div className="lg:col-span-3 flex justify-between p-0 pt-6 border-t mt-auto">
                        <Button variant="outline" onClick={() => setCurrentStep(2)}>
                            <ArrowLeft className="mr-2"/> Previous
                        </Button>
                         <Button onClick={handleGenerateContent} disabled={isGenerating}>
                             {isGenerating ? <><Sparkles className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : <>Generate Content <ChevronRight className="ml-2"/></>}
                        </Button>
                    </div>
                </div>
            );
          case 4: // Content Generation
              if (isGenerating || !article) {
                  return (
                     <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 p-6 min-h-[600px]">
                        <div className="border-r pr-6 space-y-4">
                            <h2 className="text-xl font-bold">Outline</h2>
                            <div className="space-y-1 text-sm">
                                {outlineItems.map(item => (
                                    <div key={item.id} className={cn("p-1 rounded", item.level === 'H3' && 'ml-4')}>
                                        <span className={cn("font-semibold", item.level === 'H2' ? 'text-foreground' : 'text-muted-foreground')}>{item.level}: </span>
                                        <span className="text-muted-foreground">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 mt-auto space-y-2 border-t">
                                <Button variant="outline" className="w-full" onClick={() => setCurrentStep(3)}>
                                    <ArrowLeft className="mr-2"/> Previous
                                </Button>
                                <Button variant="secondary" className="w-full" disabled>
                                    Export to Editor
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <ProgressCircle progress={generationProgress} />
                            <h2 className="text-2xl font-bold mt-6">First Draft</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm">Your personalized article will be ready in just 3-4 minutes.</p>
                            <p className="text-muted-foreground mt-1">We'll notify you via email once it's completed.</p>
                            <p className="text-muted-foreground mt-4">You may go to the dashboard and continue with your work.</p>
                            <Button asChild className="mt-6"><Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 w-4 h-4"/></Link></Button>
                             <Alert className="mt-8 text-left max-w-md">
                                <Info className="h-4 w-4" />
                                <AlertTitle className="font-semibold">Did you know?</AlertTitle>
                                <AlertDescription>
                                    75% of users never scroll past the first page of search results? Cruise Mode is your first-class ticket to that exclusive club.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                  );
              }
              // Final Draft View
              return (
                    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 p-6 min-h-[600px]">
                        <div className="border-r pr-6 space-y-4 h-full overflow-y-auto">
                            <h2 className="text-xl font-bold">Outline</h2>
                            <div className="space-y-1 text-sm">
                                <div className="p-2 rounded bg-muted/50">
                                    <p className="font-bold">{blogTitle}</p>
                                </div>
                                {outlineItems.map(item => (
                                    <div key={item.id} className={cn("p-1 rounded", item.level === 'H3' && 'ml-4')}>
                                        <span className={cn("font-semibold", item.level === 'H2' ? 'text-foreground' : 'text-muted-foreground')}>{item.level}: </span>
                                        <span className="text-muted-foreground">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 border rounded-lg space-y-2">
                                <div className="grid grid-cols-[120px_1fr] items-center">
                                    <Label className="text-muted-foreground">Meta Title</Label>
                                    <p className="text-sm font-semibold">{article.seoTitle}</p>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-start">
                                    <Label className="text-muted-foreground">Meta Description</Label>
                                    <p className="text-sm">{article.seoDescription}</p>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center">
                                    <Label className="text-muted-foreground">URL Slug</Label>
                                    <p className="text-sm">{primaryKeyword.replace(/\s+/g, '-')}</p>
                                </div>
                                 <div className="grid grid-cols-[120px_1fr] items-center">
                                    <Label className="text-muted-foreground">Schema</Label>
                                    <div>
                                        <Badge variant="secondary">BlogPosting</Badge>
                                        <Badge variant="secondary" className="ml-2">SpeakableSpecification</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg min-h-[400px] max-h-[60vh] overflow-y-auto">
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                                />
                            </div>
                            <div className="flex justify-between items-center p-2 border rounded-lg bg-muted/50">
                               <div className="flex items-center gap-4">
                                  <p className="text-sm">Content Score: <span className="font-bold text-primary">{article.readability.score}</span></p>
                                  <p className="text-sm">Word Count: <span className="font-bold text-primary">{article.seoAnalysis.wordCount}</span></p>
                               </div>
                               <div>
                                  <p className="text-sm">Key Terms Usage: <span className="font-bold text-primary">1 <span className="text-muted-foreground">/ Suggested: 1+</span></span> <CheckCircle className="inline w-4 h-4 text-green-500"/></p>
                               </div>
                            </div>
                        </div>
                         <div className="lg:col-span-3 flex justify-between p-0 pt-6 border-t mt-auto">
                            <Button variant="outline" onClick={() => setCurrentStep(3)}>
                                <ArrowLeft className="mr-2"/> Previous
                            </Button>
                             <Button onClick={handleExportToEditor}>
                                Export to Editor
                            </Button>
                        </div>
                    </div>
                );
            case 5: // Full Editor View
                if (!article) {
                    return (
                        <div className="p-8 text-center">
                            <p>An error occurred. Please go back and try generating the article again.</p>
                            <Button onClick={() => setCurrentStep(3)}>Go Back</Button>
                        </div>
                    );
                }
                return <ArticleEditor article={article} />;
          default: // Step 1: Initial View
            return null;
      }
  }

  if (serpData) {
      return (
        <div className="bg-background rounded-lg shadow-lg border">
            <header className="flex flex-row justify-between items-center p-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => {
                        if (currentStep > 1) setCurrentStep(currentStep - 1);
                        else setSerpData(null);
                    }}><ArrowLeft/></Button>
                    <div>
                        <p className="text-sm text-muted-foreground">All Articles / <span className="font-semibold text-foreground">{primaryKeyword}</span></p>
                    </div>
                </div>
                 <div className="hidden md:flex items-center gap-4">
                    <Stepper currentStep={currentStep} />
                    <Button variant="link" size="sm" className="hidden md:flex" onClick={() => setCurrentStep(5)}>Skip to Editor <ChevronRight className="w-4 h-4 ml-1"/></Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Cruise Mode <PlayCircle className="w-4 h-4 ml-2"/></Button>
                    <Button variant="ghost" size="icon"><Settings className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="icon"><File className="w-5 h-5"/></Button>
                    <Button variant="ghost" size="icon"><Wand className="w-5 h-5"/></Button>
                </div>
            </header>
            {renderContentByStep()}
        </div>
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
                            <div className="flex-grow w-full relative">
                                <Input
                                    id="primaryKeyword"
                                    name="primaryKeyword"
                                    placeholder="Enter Keyword(s)"
                                    required
                                    className="text-base h-12 flex-grow"
                                    value={primaryKeyword}
                                    onChange={handleKeywordChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                    autoComplete="off"
                                />
                                {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
                                    <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1">
                                        {suggestionsLoading ? (
                                            <div className="p-3 text-center text-sm text-muted-foreground">Loading...</div>
                                        ) : (
                                            suggestions.map(s => (
                                                <div key={s} onMouseDown={() => handleSuggestionClick(s)} className="p-3 hover:bg-muted cursor-pointer text-sm">{s}</div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
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
                            {isAnalyzing && <AnalysisProgressRow />}
                            <TableRow onClick={() => handleResume("bangladesh politics", "Bangladesh")} className="cursor-pointer">
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
