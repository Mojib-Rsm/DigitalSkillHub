
"use client";

import React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateBlueprintAction } from "@/app/ai-tools/website-blueprint-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, LayoutTemplate, Lightbulb, Check, Pilcrow, Layers, Code, Settings, Download, FileText, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

// Import jspdf for PDF generation
import { jsPDF } from "jspdf";
import "jspdf-autotable";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          জেনারেট করা হচ্ছে...
        </>
      ) : (
        <>
          <LayoutTemplate className="mr-2 h-5 w-5" />
          ব্লুপ্রিন্ট তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function WebsiteBlueprintGeneratorForm() {
  const initialState = { message: "", blueprint: null, issues: [], fields: {} };
  const [state, formAction] = useActionState(generateBlueprintAction, initialState);
  const { toast } = useToast();
  const [outputFormat, setOutputFormat] = useState("pdf");

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleDownload = () => {
    if (!state.blueprint) return;
    const { blueprint } = state;
    
    const doc = new jsPDF();
    let htmlString = `<html><head><meta charset='utf-8'><title>Website Blueprint</title></head><body>`;
    htmlString += `<h1>Website Blueprint: ${blueprint.suggestedName}</h1>`;
    htmlString += `<p><strong>Tagline:</strong> ${blueprint.tagline}</p>`;

    let yPos = 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Website Blueprint: ${blueprint.suggestedName}`, 10, yPos); yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Tagline: ${blueprint.tagline}`, 10, yPos); yPos += 15;
    
    doc.setFont("helvetica", "bold");
    doc.text("Pages & Sections", 10, yPos); yPos += 8;
    htmlString += `<h2>Pages & Sections</h2>`;
    blueprint.pages.forEach((page: any) => {
        doc.setFont("helvetica", "bold");
        doc.text(`- ${page.name}`, 15, yPos); yPos += 6;
        htmlString += `<h3>- ${page.name}</h3><ul>`;
        doc.setFont("helvetica", "normal");
        page.sections.forEach((section: string) => {
            doc.text(`  • ${section}`, 20, yPos); yPos += 6;
            htmlString += `<li>${section}</li>`;
            if (yPos > 280) { doc.addPage(); yPos = 10; }
        });
        htmlString += `</ul>`;
    });
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Key Features", 10, yPos); yPos += 8;
    htmlString += `<h2>Key Features</h2><ul>`;
    doc.setFont("helvetica", "normal");
    blueprint.keyFeatures.forEach((feature: string) => {
        doc.text(`• ${feature}`, 15, yPos); yPos += 6;
        htmlString += `<li>${feature}</li>`;
        if (yPos > 280) { doc.addPage(); yPos = 10; }
    });
    htmlString += `</ul>`;
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Technology Stack Suggestion", 10, yPos); yPos += 8;
    htmlString += `<h2>Technology Stack Suggestion</h2>`;
    doc.setFont("helvetica", "normal");
    doc.text(blueprint.techStackSuggestion, 15, yPos, { maxWidth: 180 });
    htmlString += `<p>${blueprint.techStackSuggestion}</p>`;
    htmlString += `</body></html>`;

    if (outputFormat === 'pdf') {
        doc.save(`${blueprint.suggestedName.replace(/\s+/g, '_')}_blueprint.pdf`);
    } else if (outputFormat === 'word') {
        const blob = new Blob([htmlString], { type: 'application/msword' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${blueprint.suggestedName.replace(/\s+/g, '_')}_blueprint.doc`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার ধারণা বর্ণনা করুন</CardTitle>
        <CardDescription>
          আপনার ওয়েবসাইটের জন্য একটি বিস্তারিত পরিকল্পনা পেতে ফর্মটি পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea">ওয়েবসাইটের মূল ধারণা</Label>
            <Textarea
              id="idea"
              name="idea"
              placeholder="যেমন, একটি অনলাইন প্ল্যাটফর্ম যেখানে বাংলাদেশের কারিগররা তাদের হাতে তৈরি পণ্য সরাসরি গ্রাহকদের কাছে বিক্রি করতে পারবেন।"
              defaultValue={state.fields?.idea}
              required
              rows={4}
            />
            {state.issues?.filter(i => i.toLowerCase().includes("idea")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

           <div className="space-y-2">
            <Label htmlFor="targetAudience">লক্ষ্য দর্শক (Target Audience)</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="যেমন, যারা অনন্য এবং স্থানীয় পণ্য পছন্দ করেন, পর্যটক, প্রবাসী বাংলাদেশী।"
              defaultValue={state.fields?.targetAudience}
              required
            />
            {state.issues?.filter(i => i.toLowerCase().includes("audience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coreFeatures">মূল বৈশিষ্ট্য (কমা দ্বারা পৃথক)</Label>
            <Input
              id="coreFeatures"
              name="coreFeatures"
              placeholder="যেমন, পণ্য তালিকা, বিক্রেতার প্রোফাইল, নিরাপদ পেমেন্ট গেটওয়ে, গ্রাহক পর্যালোচনা।"
              defaultValue={state.fields?.coreFeatures}
              required
            />
            {state.issues?.filter(i => i.toLowerCase().includes("feature")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <SubmitButton />
        </form>

        {useFormStatus().pending && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার ব্লুপ্রিন্ট তৈরি হচ্ছে, এটি কয়েক মুহূর্ত সময় নিতে পারে...</p>
                </div>
            </div>
        )}

        {state.blueprint && !useFormStatus().pending && (
          <div className="mt-8 space-y-6">
            <h3 className="text-3xl font-bold font-headline mb-4 text-center">আপনার ওয়েবসাইট ব্লুপ্রিন্ট</h3>
            
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-bold">{state.blueprint.suggestedName}</AlertTitle>
                <AlertDescription>{state.blueprint.tagline}</AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5 text-primary"/>Pages & Sections</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {state.blueprint.pages.map((page: any, index: number) => (
                           <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-base font-semibold">{page.name}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        {page.sections.map((section: string, i: number) => <li key={i}>{section}</li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-primary"/>Key Features</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        {state.blueprint.keyFeatures.map((feature: string, i: number) => <li key={i}>{feature}</li>)}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Code className="w-5 h-5 text-primary"/>Technology Stack</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">{state.blueprint.techStackSuggestion}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-primary"/>ডাউনলোড অপশন</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        <Label>ডাউনলোড ফরম্যাট</Label>
                        <RadioGroup name="outputFormat" defaultValue="pdf" onValueChange={setOutputFormat} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                                <Label htmlFor="pdf" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <FileDown className="mb-3 h-6 w-6"/>
                                    PDF (.pdf)
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="word" id="word" className="peer sr-only" />
                                <Label htmlFor="word" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <FileText className="mb-3 h-6 w-6"/>
                                    Word (.doc)
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleDownload} size="lg" className="w-full">
                        <Download className="mr-2 h-5 w-5" />
                        ডাউনলোড ব্লুপ্রিন্ট ({outputFormat.toUpperCase()})
                    </Button>
                </CardFooter>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}

