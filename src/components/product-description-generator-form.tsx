
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateDescription } from "@/app/ai-tools/product-description-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard } from "lucide-react";
import { useEffect, useRef } from "react";
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
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Description
        </>
      )}
    </Button>
  );
}

export default function ProductDescriptionGeneratorForm() {
  const initialState = { message: "", description: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateDescription, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
    }
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.description) {
      navigator.clipboard.writeText(state.description);
      toast({
        title: "Copied!",
        description: "Product description copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Describe Your Product</CardTitle>
        <CardDescription>
          Enter your product details and let AI write a compelling description for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="e.g., Hand-stitched Nakshi Kantha"
              defaultValue={state.fields?.productName}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("name"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="productFeatures">Key Features (comma-separated)</Label>
            <Textarea
              id="productFeatures"
              name="productFeatures"
              placeholder="e.g., Pure cotton, traditional design, vibrant colors"
              defaultValue={state.fields?.productFeatures}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("feature"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="e.g., Women who love traditional crafts, home decor enthusiasts"
              defaultValue={state.fields?.targetAudience}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("audience"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.description && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Description</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground">{state.description}</p>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
