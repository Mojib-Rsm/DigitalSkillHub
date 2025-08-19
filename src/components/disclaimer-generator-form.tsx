
"use client";

import React from "react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateDisclaimer } from "@/app/free-tools/disclaimer-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, GanttChartSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
          <GanttChartSquare className="mr-2 h-5 w-5" />
          Generate Disclaimer
        </>
      )}
    </Button>
  );
}

export default function DisclaimerGeneratorForm() {
  const initialState = { message: "", policy: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateDisclaimer, initialState);
  const { toast } = useToast();

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
        description: "Disclaimer has been copied to the clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Enter Your Details</CardTitle>
        <CardDescription>
          Provide the necessary information to generate your disclaimer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website/App URL</Label>
              <Input id="websiteUrl" name="websiteUrl" placeholder="e.g., https://totthoai.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" placeholder="e.g., TotthoAi" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disclaimerTypes">Types of Disclaimers (comma separated)</Label>
              <Input id="disclaimerTypes" name="disclaimerTypes" placeholder="e.g., Affiliate, Testimonials, Informational" required />
            </div>
          <SubmitButton />
        </form>

        {state.policy && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Your Disclaimer</h3>
            <Card className="bg-muted/50 relative max-h-96 overflow-y-auto">
              <CardContent className="p-4">
                 <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: state.policy.replace(/\n/g, '<br />') }}></div>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
             <Button className="w-full mt-4" onClick={handleCopy}>Copy Disclaimer</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
