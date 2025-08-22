
"use client";

import React, { useEffect, useRef } from "react";
import { useActionState, useFormStatus } from "react-dom";
import { checkSeoScoreAction } from "@/app/ai-tools/seo-score-checker/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, BarChart2, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          বিশ্লেষণ করা হচ্ছে...
        </>
      ) : (
        <>
          <BarChart2 className="mr-2 h-5 w-5" />
          স্কোর চেক করুন
        </>
      )}
    </Button>
  );
}

const ScoreCircle = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const strokeDashoffset = circumference - (score / 100) * circumference;
    let colorClass = 'text-green-500';
    if (score < 50) colorClass = 'text-red-500';
    else if (score < 80) colorClass = 'text-yellow-500';

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-muted"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`transform -rotate-90 origin-center transition-all duration-1000 ${colorClass}`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
            </div>
        </div>
    )
};


export default function SeoScoreCheckerForm() {
  const initialState = { message: "", issues: [], data: undefined, fields: {} };
  const [state, formAction] = useActionState(checkSeoScoreAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        });
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার কনটেন্টের SEO স্কোর পরীক্ষা করুন</CardTitle>
        <CardDescription>
          আপনার কনটেন্ট এবং টার্গেট কীওয়ার্ডটি পেস্ট করে একটি বিস্তারিত SEO বিশ্লেষণ পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">আপনার কনটেন্ট</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="আপনার সম্পূর্ণ আর্টিকেল বা কনটেন্ট এখানে পেস্ট করুন..."
              defaultValue={state.fields?.content}
              required
              rows={12}
            />
            {state.issues?.filter(i => i.toLowerCase().includes("content")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="keyword">টার্গেট কীওয়ার্ড</Label>
            <Input
              id="keyword"
              name="keyword"
              placeholder="যেমন, 'ডিজিটাল মার্কেটিং', 'ফ্রিল্যান্সিং টিপস'"
              defaultValue={state.fields?.keyword}
              required
            />
            {state.issues?.filter(i => i.toLowerCase().includes("keyword")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {useFormStatus().pending && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground font-semibold animate-pulse">আপনার কনটেন্ট বিশ্লেষণ করা হচ্ছে...</p>
                </div>
            </div>
        )}

        {state.data && !useFormStatus().pending && (
          <div className="mt-8 space-y-6">
            <h3 className="text-3xl font-bold font-headline text-center">আপনার SEO ফলাফল</h3>
            
            <div className="flex flex-col items-center justify-center">
                <ScoreCircle score={state.data.score} />
                <p className="mt-2 text-lg text-muted-foreground font-semibold">Overall Score</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/>উন্নতির জন্য সুপারিশ</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ul className="list-none space-y-3">
                        {state.data.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0"/> 
                                <span className="text-muted-foreground">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
