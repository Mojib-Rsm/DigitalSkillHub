
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { suggestDomains } from "@/app/ai-tools/domain-name-suggester/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Globe, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          অনুসন্ধান করা হচ্ছে...
        </>
      ) : (
        <>
          <Globe className="mr-2 h-5 w-5" />
          ডোমেইন খুঁজুন
        </>
      )}
    </Button>
  );
}

export default function DomainNameSuggesterForm() {
  const initialState = { message: "", domains: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(suggestDomains, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
    }
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>ডোমেইন নেম খুঁজুন</CardTitle>
        <CardDescription>
          আপনার ব্যবসার জন্য সেরা নামটি খুঁজে পেতে কিছু কীওয়ার্ড দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="keywords">কীওয়ার্ড (কমা দ্বারা পৃথক)</Label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="যেমন, digital, craft, bangla, shop"
              defaultValue={state.fields?.keywords}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("keyword"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tlds">পছন্দের TLD (কমা দ্বারা পৃথক)</Label>
            <Input
              id="tlds"
              name="tlds"
              placeholder="যেমন, .com, .net, .org, .com.bd"
              defaultValue={state.fields?.tlds ?? ".com, .com.bd"}
              required
            />
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("tld"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.domains && state.domains.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">সুপারিশকৃত ডোমেইন</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {state.domains.map((domain, index) => (
                 <a 
                    key={index} 
                    href={`https://domains.google.com/registrar/search?searchTerm=${domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-muted text-muted-foreground rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    <Check className="w-4 h-4" />
                    {domain}
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">একটি ডোমেইনে ক্লিক করে প্রাপ্যতা পরীক্ষা করুন।</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
