
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generatePrivacyPolicy } from "@/app/free-tools/privacy-policy-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";

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
          <ShieldCheck className="mr-2 h-5 w-5" />
          Generate Policy
        </>
      )}
    </Button>
  );
}

export default function PrivacyPolicyGeneratorForm() {
  const initialState = { message: "", policy: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generatePrivacyPolicy, initialState);
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
        description: "Privacy Policy has been copied to the clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Enter Your Details</CardTitle>
        <CardDescription>
          Provide the necessary information to generate your privacy policy.
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
              <Label htmlFor="dataCollected">What data do you collect?</Label>
              <Textarea id="dataCollected" name="dataCollected" placeholder="e.g., names, emails, cookies, analytics data" required />
          </div>
           <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" placeholder="e.g., support@totthoai.com" required />
            </div>
          <SubmitButton />
        </form>

        {state.policy && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Your Privacy Policy</h3>
            <Card className="bg-muted/50 relative max-h-96 overflow-y-auto">
              <CardContent className="p-4">
                <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: state.policy.replace(/\n/g, '<br />') }}></div>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
             <Button className="w-full mt-4" onClick={handleCopy}>Copy Policy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
