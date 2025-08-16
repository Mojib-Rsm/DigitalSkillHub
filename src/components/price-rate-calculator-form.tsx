
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { calculatePrice } from "@/app/ai-tools/price-rate-calculator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Calculating...
        </>
      ) : (
        <>
          <DollarSign className="mr-2 h-5 w-5" />
          Calculate Price
        </>
      )}
    </Button>
  );
}

export default function PriceRateCalculatorForm() {
  const initialState = { message: "", priceRange: "", justification: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(calculatePrice, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      // Do not reset the form, user may want to tweak inputs.
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
        <CardTitle>Calculate Your Project Rate</CardTitle>
        <CardDescription>
          Answer a few questions to get a suggested price range for your work.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>
            <Input
              id="projectType"
              name="projectType"
              placeholder="e.g., 5-page website design, 1000-word blog post"
              defaultValue={state.fields?.projectType}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("project")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Select name="complexity" defaultValue={state.fields?.complexity}>
                <SelectTrigger id="complexity">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              {state.issues?.filter((issue) => issue.toLowerCase().includes("complexity")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Your Experience Level</Label>
              <Select name="experienceLevel" defaultValue={state.fields?.experienceLevel}>
                <SelectTrigger id="experienceLevel">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              {state.issues?.filter((issue) => issue.toLowerCase().includes("experience")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          
          <SubmitButton />
        </form>

        {state.priceRange && state.justification && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Suggested Price</h3>
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertTitle className="text-2xl font-bold text-primary">{state.priceRange}</AlertTitle>
              <AlertDescription className="mt-2">
                {state.justification}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
