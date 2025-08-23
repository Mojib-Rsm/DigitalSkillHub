
"use client";

import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { checkSeoScoreAction } from "@/app/ai-tools/seo-score-checker/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, BarChart2, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SeoScoreCheckerOutput } from "@/ai/flows/seo-score-checker";

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSubmitting;
  return (
    <Button type="submit" disabled={isDisabled} size="lg" className="w-full">
      {isDisabled ? (
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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<SeoScoreCheckerOutput | undefined>(undefined);
  const [issues, setIssues] = useState<string[] | undefined>(undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setData(undefined);
    setIssues(undefined);

    const formData = new FormData(event.currentTarget);
    const result = await checkSeoScoreAction({
        content: formData.get('content') as string,
        keyword: formData.get('keyword') as string,
    });

    if (result.success) {
        setData(result.data);
    } else {
        setIssues(result.issues);
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: result.issues?.join(", ") || "An unknown error occurred.",
        });
    }

    setIsSubmitting(false);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>আপনার কনটেন্টের SEO স্কোর পরীক্ষা করুন</CardTitle>
        <CardDescription>
          আপনার কনটেন্ট এবং টার্গেট কীওয়ার্ডটি পেস্ট করে একটি বিস্তারিত SEO বিশ্লেষণ পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">আপনার কনটেন্ট</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="আপনার সম্পূর্ণ আর্টিকেল বা কনটেন্ট এখানে পেস্ট করুন..."
              required
              rows={12}
            />
            {issues?.filter(i => i.toLowerCase().includes("content")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
           <div className="space-y-2">
            <Label htmlFor="keyword">টার্গেট কীওয়ার্ড</Label>
            <Input
              id="keyword"
              name="keyword"
              placeholder="যেমন, 'ডিজিটাল মার্কেটিং', 'ফ্রিল্যান্সিং টিপস'"
              required
            />
            {issues?.filter(i => i.toLowerCase().includes("keyword")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton isSubmitting={isSubmitting} />
        </form>

        {isSubmitting && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground font-semibold animate-pulse">আপনার কনটেন্ট বিশ্লেষণ করা হচ্ছে...</p>
                </div>
            </div>
        )}

        {data && !isSubmitting && (
          <div className="mt-8 space-y-6">
            <h3 className="text-3xl font-bold font-headline text-center">আপনার SEO ফলাফল</h3>
            
            <div className="flex flex-col items-center justify-center">
                <ScoreCircle score={data.score} />
                <p className="mt-2 text-lg text-muted-foreground font-semibold">Overall Score</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/>উন্নতির জন্য সুপারিশ</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ul className="list-none space-y-3">
                        {data.recommendations.map((rec, i) => (
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
