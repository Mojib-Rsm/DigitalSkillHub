
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateRefundPolicy } from "@/app/ai-tools/refund-policy-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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
          <Receipt className="mr-2 h-5 w-5" />
          পলিসি তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function RefundPolicyGeneratorForm() {
  const initialState = { message: "", policy: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateRefundPolicy, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message !== "" && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.policy) {
      navigator.clipboard.writeText(state.policy);
      toast({
        title: "কপি করা হয়েছে!",
        description: "রিফান্ড পলিসি ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার ব্যবসার বিবরণ দিন</CardTitle>
        <CardDescription>
          একটি কাস্টমাইজড রিফান্ড পলিসি তৈরি করতে নিচের তথ্যগুলো পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">কোম্পানির নাম</Label>
              <Input id="companyName" name="companyName" placeholder="যেমন, TotthoAi" required />
               {state.issues?.filter(i => i.toLowerCase().includes("কোম্পানি")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">পণ্যের ধরন</Label>
              <Input id="productType" name="productType" placeholder="যেমন, ডিজিটাল কোর্স, হাতে তৈরি পণ্য" required />
              {state.issues?.filter(i => i.toLowerCase().includes("পণ্য")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refundTimeframe">রিফান্ডের সময়সীমা</Label>
              <Input id="refundTimeframe" name="refundTimeframe" placeholder="যেমন, ৭ দিন, ১৪ দিন" required />
               {state.issues?.filter(i => i.toLowerCase().includes("সময়সীমা")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">যোগাযোগের ইমেল</Label>
              <Input id="contactEmail" name="contactEmail" type="email" placeholder="যেমন, support@example.com" required />
              {state.issues?.filter(i => i.toLowerCase().includes("ইমেল")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="conditions">রিফান্ডের শর্তাবলী</Label>
            <Textarea id="conditions" name="conditions" placeholder="যেমন, পণ্যটি অবশ্যই অব্যবহৃত হতে হবে, কোর্স ২৫% এর কম দেখা থাকতে হবে।" required rows={4}/>
            {state.issues?.filter(i => i.toLowerCase().includes("শর্তাবলী")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
           {state.message === "Validation Error" && state.issues?.length === 0 && (
                <Alert variant="destructive">
                    <AlertDescription>অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।</AlertDescription>
                </Alert>
           )}

          <SubmitButton />
        </form>

        {state.policy && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">আপনার রিফান্ড পলিসি</h3>
            <Card className="bg-muted/50 relative max-h-96 overflow-y-auto">
              <CardContent className="p-4">
                 <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: state.policy.replace(/\n/g, '<br />') }}></div>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
             <Button className="w-full mt-4" onClick={handleCopy}>পলিসি কপি করুন</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
