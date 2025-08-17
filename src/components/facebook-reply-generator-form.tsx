
"use client";

import React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateFacebookReplies } from "@/app/ai-tools/facebook-reply-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, CornerDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
          <CornerDownRight className="mr-2 h-5 w-5" />
          রিপ্লাই তৈরি করুন
        </>
      )}
    </Button>
  );
}

export default function FacebookReplyGeneratorForm() {
  const initialState = { message: "", suggestions: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateFacebookReplies, initialState);
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

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "কপি করা হয়েছে!",
      description: "রিপ্লাইটি ক্লিপবোর্ডে কপি করা হয়েছে।",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>কমেন্টের রিপ্লাই তৈরি করুন</CardTitle>
        <CardDescription>
          আসল পোস্ট এবং যে কমেন্টের রিপ্লাই দিতে চান তা লিখুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="postContent">আসল পোস্টের বিষয়বস্তু</Label>
            <Textarea
              id="postContent"
              name="postContent"
              placeholder="আসল ফেসবুক পোস্টটি এখানে পেস্ট করুন..."
              defaultValue={state.fields?.postContent}
              rows={4}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("পোস্ট")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="commentToReply">যে কমেন্টের রিপ্লাই দেবেন</Label>
            <Textarea
              id="commentToReply"
              name="commentToReply"
              placeholder="এখানে কমেন্টটি পেস্ট করুন..."
              defaultValue={state.fields?.commentToReply}
              rows={3}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("কমেন্ট")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          
          <SubmitButton />
        </form>

        {state.suggestions && state.suggestions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold font-headline mb-4 text-center">সুপারিশকৃত রিপ্লাই</h3>
            <div className="space-y-3">
            {state.suggestions.map((suggestion, index) => (
                <Card key={index} className="bg-muted/50 relative group">
                <CardContent className="p-4 pr-12">
                    <p className="text-muted-foreground">{suggestion}</p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(suggestion)}>
                        <Clipboard className="w-5 h-5"/>
                    </Button>
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
