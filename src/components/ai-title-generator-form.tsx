
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateTitlesAction } from "@/app/ai-tools/ai-title-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Asterisk, ChevronsUpDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AiTitleGeneratorOutput } from "@/ai/flows/ai-title-generator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";

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
          <Asterisk className="mr-2 h-5 w-5" />
          টাইটেল তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function AiTitleGeneratorForm() {
  const [data, setData] = useState<AiTitleGeneratorOutput | undefined>(undefined);
  const [issues, setIssues] = useState<Record<string, string[]> | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [country, setCountry] = useState("Bangladesh");
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
      setIsSubmitting(true);
      setData(undefined);
      setIssues(undefined);

      formData.set('targetCountry', country);
      const result = await generateTitlesAction(formData);

      if (result.success) {
          setData(result.data);
          formRef.current?.reset();
      } else {
          if (result.issues) {
              setIssues(result.issues as any);
          } else {
            toast({
                variant: "destructive",
                title: "ত্রুটি",
                description: "An unknown error occurred.",
            })
          }
      }
      setIsSubmitting(false);
  };


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি করা হয়েছে!",
      description: "টাইটেল ক্লিপবোর্ডে কপি করা হয়েছে।",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI টাইটেল জেনারেটর</CardTitle>
        <CardDescription>
          আপনার কীওয়ার্ড এবং টার্গেট দেশ দিন এবং সেরা টাইটেল পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primaryKeyword">প্রধান কীওয়ার্ড</Label>
            <Input
              id="primaryKeyword"
              name="primaryKeyword"
              placeholder="যেমন, এসইও টিপস"
              required
            />
            {issues?.primaryKeyword && <p className="text-sm font-medium text-destructive">{issues.primaryKeyword[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">টার্গেট দেশ</Label>
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
             {issues?.targetCountry && <p className="text-sm font-medium text-destructive">{issues.targetCountry[0]}</p>}
          </div>

          <SubmitButton />
        </form>

        {isSubmitting && (
            <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">আপনার টাইটেল তৈরি হচ্ছে...</p>
                </div>
            </div>
        )}

        {data && (
          <div className="mt-8 space-y-3">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">জেনারেটেড টাইটেল</h3>
            {data.titles.map((title, index) => (
                <Card key={index} className="bg-muted/50 relative group">
                <CardContent className="p-3 flex items-center gap-3">
                    <p className="font-medium flex-1">{title}</p>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleCopy(title)}>
                        <Clipboard className="w-4 h-4"/>
                    </Button>
                </CardContent>
                </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
