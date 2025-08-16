
"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateNames } from "@/app/ai-tools/business-name-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Lightbulb } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
          <Lightbulb className="mr-2 h-5 w-5" />
          Generate Names
        </>
      )}
    </Button>
  );
}

export default function BusinessNameGeneratorForm() {
  const initialState = { message: "", names: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateNames, initialState);
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Find the Perfect Business Name</CardTitle>
        <CardDescription>
          Describe your business and get a list of creative name ideas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry / Niche</Label>
            <Input
              id="industry"
              name="industry"
              placeholder="e.g., Handmade Crafts, Home Bakery, Digital Marketing Agency"
              defaultValue={state.fields?.industry}
              required
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("industry"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="e.g., creative, authentic, local, quality, fast"
              defaultValue={state.fields?.keywords}
              required
            />
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("keyword"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Name Style</Label>
            <Select name="style" defaultValue={state.fields?.style}>
                <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Traditional">Traditional</SelectItem>
                    <SelectItem value="Elegant">Elegant</SelectItem>
                    <SelectItem value="Playful">Playful</SelectItem>
                </SelectContent>
            </Select>
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("style"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.names && state.names.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Names</h3>
            <div className="space-y-3">
              {state.names.map((name, index) => (
                <Card key={index} className="bg-background/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Lightbulb className="w-6 h-6 text-accent"/>
                    <p className="font-medium flex-1">{name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
