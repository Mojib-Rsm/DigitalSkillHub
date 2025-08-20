
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
import { Sparkles, LayoutTemplate, Lightbulb, Check, Pilcrow, Layers, Code, Settings, Download, FileText, FileDown, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";

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

const features = [
    { id: "user_login", label: "ব্যবহারকারী লগইন এবং প্রোফাইল" },
    { id: "blog_section", label: "ব্লগ সেকশন" },
    { id: "payment_gateway", label: "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন" },
    { id: "product_listing", label: "পণ্য বা পরিষেবা তালিকা" },
    { id: "search_functionality", label: "সার্চ কার্যকারিতা" },
    { id: "contact_form", label: "যোগাযোগ ফরম" },
    { id: "customer_reviews", label: "গ্রাহক পর্যালোচনা সিস্টেম" },
    { id: "social_media_integration", label: "সোশ্যাল মিডিয়া ইন্টিগ্রেশন" },
]


export default function WebsiteBlueprintGeneratorForm() {
  const initialState = { message: "", blueprint: null, issues: [], fields: {} };
  const [state, formAction] = useActionState(generateBlueprintAction, initialState);
  const { toast } = useToast();
  const [outputFormat, setOutputFormat] = useState("pdf");

  const [websiteType, setWebsiteType] = useState(initialState.fields?.websiteType || "");
  const [targetAudience, setTargetAudience] = useState(initialState.fields?.targetAudience || "");
  const [country, setCountry] = useState(initialState.fields?.country || "");
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ভাষা নির্বাচন করুন</Label>
                <Select name="language" defaultValue="Bengali">
                    <SelectTrigger>
                        <SelectValue placeholder="ভাষা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Bengali">বাংলা</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                </Select>
                 {state.issues?.filter(i => i.toLowerCase().includes("language")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">দেশ নির্বাচন করুন</Label>
                <input type="hidden" name="country" value={country} />
                    <Popover open={countrySelectOpen} onOpenChange={setCountrySelectOpen}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countrySelectOpen}
                            className="w-full justify-between font-normal"
                        >
                            {country
                            ? countries.find((c) => c.value.toLowerCase() === country.toLowerCase())?.label
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
                                value={c.label}
                                onSelect={(currentValue) => {
                                    const selectedCountry = countries.find(c => c.label.toLowerCase() === currentValue.toLowerCase());
                                    setCountry(selectedCountry ? selectedCountry.value : "");
                                    setCountrySelectOpen(false);
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
                 {state.issues?.filter(i => i.toLowerCase().includes("country")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
              </div>
          </div>
          <div className="space-y-2">
                <Label htmlFor="websiteType">ওয়েবসাইটের ধরন</Label>
                <Select name="websiteType" value={websiteType} onValueChange={setWebsiteType}>
                    <SelectTrigger id="websiteType">
                        <SelectValue placeholder="একটি ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>ব্যবসা ও কমার্স</SelectLabel>
                            <SelectItem value="E-commerce Store">ই-কমার্স স্টোর</SelectItem>
                            <SelectItem value="Company Profile">কোম্পানি প্রোফাইল</SelectItem>
                            <SelectItem value="Freelancer Portfolio">ফ্রিল্যান্সার পোর্টফোলিও</SelectItem>
                            <SelectItem value="Service Provider Website">সার্ভিস প্রোভাইডার ওয়েবসাইট</SelectItem>
                            <SelectItem value="Restaurant / Cafe Website">রেস্টুরেন্ট / ক্যাফে ওয়েবসাইট</SelectItem>
                            <SelectItem value="Hotel / Hostel Booking Website">হোটেল / হোস্টেল বুকিং ওয়েবসাইট</SelectItem>
                            <SelectItem value="Travel Agency Website">ট্রাভেল এজেন্সি ওয়েবসাইট</SelectItem>
                            <SelectItem value="Fitness Gym / Coaching Website">ফিটনেস জিম / কোচিং ওয়েবসাইট</SelectItem>
                            <SelectItem value="Real Estate Website">রিয়েল এস্টেট ওয়েবসাইট</SelectItem>
                            <SelectItem value="SaaS Landing Page">SaaS ল্যান্ডিং পেজ</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>নিউজ ও মিডিয়া</SelectLabel>
                            <SelectItem value="Online News Portal">অনলাইন নিউজ পোর্টাল</SelectItem>
                            <SelectItem value="Blog Website">ব্লগ ওয়েবসাইট</SelectItem>
                            <SelectItem value="Digital Magazine">ডিজিটাল ম্যাগাজিন</SelectItem>
                            <SelectItem value="Video Content Website">ভিডিও কনটেন্ট ওয়েবসাইট</SelectItem>
                            <SelectItem value="Podcast Website">পডকাস্ট ওয়েবসাইট</SelectItem>
                            <SelectItem value="Lifestyle & Interview Website">লাইফস্টাইল ও ইন্টারভিউ ওয়েবসাইট</SelectItem>
                            <SelectItem value="Sports News Website">স্পোর্টস নিউজ ওয়েবসাইট</SelectItem>
                        </SelectGroup>
                         <SelectGroup>
                            <SelectLabel>শিক্ষা ও লার্নিং</SelectLabel>
                            <SelectItem value="Online Course Website">অনলাইন কোর্স ওয়েবসাইট</SelectItem>
                            <SelectItem value="School / College / University Website">স্কুল / কলেজ / বিশ্ববিদ্যালয় ওয়েবসাইট</SelectItem>
                            <SelectItem value="Tutorial Website">টিউটোরিয়াল ওয়েবসাইট</SelectItem>
                            <SelectItem value="Ebook / Study Material Website">ইবুক / স্টাডি ম্যাটেরিয়াল ওয়েবসাইট</SelectItem>
                            <SelectItem value="Exam & Marksheet Generator Website">পরীক্ষা ও মার্কশিট জেনারেটর ওয়েবসাইট</SelectItem>
                            <SelectItem value="Library or Resource Website">লাইব্রেরি বা রিসোর্স ওয়েবসাইট</SelectItem>
                        </SelectGroup>
                         <SelectGroup>
                            <SelectLabel>সোশ্যাল ও কমিউনিটি</SelectLabel>
                            <SelectItem value="Social Networking Website">সোশ্যাল নেটওয়ার্কিং ওয়েবসাইট</SelectItem>
                            <SelectItem value="Online Forum or Community Website">অনলাইন ফোরাম বা কমিউনিটি ওয়েবসাইট</SelectItem>
                            <SelectItem value="Event & Meetup Website">ইভেন্ট ও মিটআপ ওয়েবসাইট</SelectItem>
                            <SelectItem value="Chat Room / Messaging Platform">চ্যাট রুম / মেসেজিং প্ল্যাটফর্ম</SelectItem>
                            <SelectItem value="Review and Rating Website">রিভিউ এবং রেটিং ওয়েবসাইট</SelectItem>
                            <SelectItem value="NGO or Voluntary Organization Website">NGO বা স্বেচ্ছাসেবী সংস্থা ওয়েবসাইট</SelectItem>
                        </SelectGroup>
                        <SelectItem value="Other">অন্যান্য</SelectItem>
                    </SelectContent>
                </Select>
                 {state.issues?.filter(i => i.toLowerCase().includes("type")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          {websiteType === 'Other' && (
             <div className="space-y-2 animate-in fade-in-50">
                <Label htmlFor="otherWebsiteType">আপনার নিজের ওয়েবসাইটের ধরন লিখুন</Label>
                <Input name="otherWebsiteType" id="otherWebsiteType" placeholder="যেমন, ব্যক্তিগত গ্যালারি" defaultValue={state.fields?.otherWebsiteType} />
                {state.issues?.filter(i => i.toLowerCase().includes("custom website type")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          )}

          <div className="space-y-2">
                <Label htmlFor="targetAudience">লক্ষ্য দর্শক</Label>
                <Select name="targetAudience" value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger id="targetAudience">
                        <SelectValue placeholder="দর্শক নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="General users and online shoppers">সাধারণ ব্যবহারকারী ও অনলাইন ক্রেতা</SelectItem>
                        <SelectItem value="Potential clients and investors">সম্ভাব্য ক্লায়েন্ট ও বিনিয়োগকারী</SelectItem>
                        <SelectItem value="Clients and employers">ক্লায়েন্ট এবং চাকরিদাতা</SelectItem>
                        <SelectItem value="Food lovers and tourists">খাদ্যপ্রেমী ও পর্যটক</SelectItem>
                        <SelectItem value="Travelers and families">ভ্রমণকারী ও পরিবার</SelectItem>
                        <SelectItem value="Fitness enthusiasts and athletes">ফিটনেস উত্সাহী ও ক্রীড়াবিদ</SelectItem>
                        <SelectItem value="House seekers and investors">বাড়ি/ফ্ল্যাট খোঁজকারী ও বিনিয়োগকারী</SelectItem>
                        <SelectItem value="General readers and researchers">সাধারণ পাঠক ও গবেষক</SelectItem>
                        <SelectItem value="Niche readers (e.g., travel, tech)">নির্দিষ্ট বিষয়ের পাঠক (যেমন, ভ্রমণ, প্রযুক্তি)</SelectItem>
                        <SelectItem value="Students and professionals">ছাত্র ও পেশাজীবী</SelectItem>
                        <SelectItem value="Students, parents, and teachers">ছাত্র, অভিভাবক ও শিক্ষক</SelectItem>
                        <SelectItem value="Hobbyists and community members">শখের মানুষ ও কমিউনিটি সদস্য</SelectItem>
                        <SelectItem value="Donors and volunteers">দাতা ও স্বেচ্ছাসেবী</SelectItem>
                        <SelectItem value="Other">অন্যান্য</SelectItem>
                    </SelectContent>
                </Select>
                 {state.issues?.filter(i => i.toLowerCase().includes("audience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
             {targetAudience === 'Other' && (
             <div className="space-y-2 animate-in fade-in-50">
                <Label htmlFor="otherTargetAudience">আপনার নিজের লক্ষ্য দর্শক লিখুন</Label>
                <Input name="otherTargetAudience" id="otherTargetAudience" placeholder="যেমন, চিত্রশিল্পী এবং শিল্প সংগ্রাহক" defaultValue={state.fields?.otherTargetAudience} />
                {state.issues?.filter(i => i.toLowerCase().includes("custom target audience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          )}
          
           <div className="space-y-2">
            <Label>মূল বৈশিষ্ট্য</Label>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                {features.map((feature) => (
                    <div className="flex items-center space-x-2" key={feature.id}>
                        <Checkbox id={feature.id} name="coreFeatures" value={feature.label} />
                        <Label htmlFor={feature.id} className="font-normal">{feature.label}</Label>
                    </div>
                ))}
            </div>
             {state.issues?.filter(i => i.toLowerCase().includes("feature")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="briefDescription">ওয়েবসাইটের সংক্ষিপ্ত বিবরণ</Label>
            <Textarea
              id="briefDescription"
              name="briefDescription"
              placeholder="আপনার ওয়েবসাইটটি কী সম্পর্কে, তা এক বাক্যে বর্ণনা করুন..."
              defaultValue={state.fields?.briefDescription}
              required
              rows={2}
            />
            {state.issues?.filter(i => i.toLowerCase().includes("idea") || i.toLowerCase().includes("description")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
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
