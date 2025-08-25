
"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { getSerpAnalysisAction, generateArticleFromSerpAction } from "@/app/ai-tools/one-click-writer-serp/actions";
import type { SerpAnalysisResult } from "@/app/ai-tools/one-click-writer-serp/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot, Info, ExternalLink, Link as LinkIcon, CheckCircle, Tag, ChevronsUpDown, Check, TrendingUp, ImageIcon, Smile, Frown, Meh, BookOpen, Fingerprint, Share2, Search, BarChart, Users, HelpCircle, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";
import OneClickWriterForm from "./one-click-writer-form";
import type { OneClickWriterOutput } from "@/ai/flows/one-click-writer";
import Image from "next/image";

// Remark and rehype plugins for markdown rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

function CreateButton() {
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
  const [serpData, setSerpData] = useState<SerpAnalysisResult | null>(null);
  const [country, setCountry] = useState("Bangladesh");
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const [primaryKeyword, setPrimaryKeyword] = useState("");

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

  return (
    <div>
        {!serpData ? (
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
                        <CreateButton />
                    </form>
                </CardContent>
            </Card>
        ): (
            <div className="space-y-6">
                 <Button variant="outline" onClick={() => setSerpData(null)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Keyword
                </Button>
                <OneClickWriterForm 
                    initialKeyword={primaryKeyword}
                    initialCountry={country}
                />
            </div>
        )}
    </div>
  );
}
