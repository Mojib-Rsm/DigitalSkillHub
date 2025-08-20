
"use client";

import React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateTermsOfService } from "@/app/free-tools/terms-of-service-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { countries } from "@/lib/countries";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-5 w-5" />
          Generate Terms
        </>
      )}
    </Button>
  );
}

export default function TermsOfServiceGeneratorForm() {
  const initialState = { message: "", policy: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateTermsOfService, initialState);
  const { toast } = useToast();
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState("")

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.policy) {
      navigator.clipboard.writeText(state.policy);
      toast({
        title: "Copied!",
        description: "Terms of Service have been copied to the clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Enter Your Details</CardTitle>
        <CardDescription>
          Provide the necessary information to generate your Terms of Service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" placeholder="e.g., TotthoAi" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input id="websiteUrl" name="websiteUrl" placeholder="e.g., https://totthoai.mojib.me" required />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="country">Country of Jurisdiction</Label>
               <input type="hidden" name="country" value={country} />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {country
                        ? countries.find((c) => c.value.toLowerCase() === country.toLowerCase())?.label
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
                                setCountry(currentValue === country ? "" : currentValue)
                                setOpen(false)
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
             <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" placeholder="e.g., legal@totthoai.com" required />
            </div>
          <SubmitButton />
        </form>

        {state.policy && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Your Terms of Service</h3>
            <Card className="bg-muted/50 relative max-h-96 overflow-y-auto">
              <CardContent className="p-4">
                 <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: state.policy.replace(/\n/g, '<br />') }}></div>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
            <Button className="w-full mt-4" onClick={handleCopy}>Copy Terms</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
