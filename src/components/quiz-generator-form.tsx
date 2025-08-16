
"use client";

import React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateQuiz } from "@/app/ai-tools/quiz-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, HelpCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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
          <HelpCircle className="mr-2 h-5 w-5" />
          Generate Quiz
        </>
      )}
    </Button>
  );
}

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizGeneratorForm() {
  const initialState = { message: "", questions: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateQuiz, initialState);
  const [numQuestions, setNumQuestions] = useState(5);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        });
    }
    if(state.message === "success") {
        setUserAnswers({});
        setSubmitted(false);
    }
  }, [state, toast]);

  const handleAnswerChange = (qIndex: number, value: string) => {
    setUserAnswers(prev => ({...prev, [qIndex]: value}));
  };

  const calculateScore = () => {
    if (!state.questions) return 0;
    return state.questions.reduce((score, q, i) => {
        return userAnswers[i] === q.answer ? score + 1 : score;
    }, 0);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create a Quiz</CardTitle>
        <CardDescription>
          Provide some text and the number of questions to generate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Source Text</Label>
            <Textarea
              id="text"
              name="text"
              placeholder="Paste the text you want to create a quiz from..."
              defaultValue={state.fields?.text as string}
              required
              rows={8}
            />
            {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions: {numQuestions}</Label>
            <input type="hidden" name="numQuestions" value={numQuestions} />
            <Slider
              id="numQuestions"
              min={1}
              max={10}
              step={1}
              value={[numQuestions]}
              onValueChange={(value) => setNumQuestions(value[0])}
            />
          </div>
          <SubmitButton />
        </form>

        {state.questions && state.questions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Quiz</h3>
            <div className="space-y-6">
              {state.questions.map((q, qIndex) => (
                <Card key={qIndex} className="bg-background/50">
                  <CardHeader>
                    <CardTitle className="text-base">{qIndex + 1}. {q.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                        onValueChange={(value) => handleAnswerChange(qIndex, value)}
                        disabled={submitted}
                    >
                      {q.options.map((option, oIndex) => {
                        const isCorrect = option === q.answer;
                        const isSelected = userAnswers[qIndex] === option;
                        return (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`q${qIndex}o${oIndex}`} />
                                <Label htmlFor={`q${qIndex}o${oIndex}`} className="flex items-center gap-2">
                                    {option}
                                    {submitted && isSelected && !isCorrect && <X className="w-4 h-4 text-destructive"/>}
                                    {submitted && isCorrect && <Check className="w-4 h-4 text-green-500"/>}
                                </Label>
                            </div>
                        )
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>
            {!submitted ? (
                 <Button onClick={() => setSubmitted(true)} size="lg" className="w-full mt-6">Submit Quiz</Button>
            ) : (
                <Card className="mt-6 bg-muted">
                    <CardContent className="p-4 text-center">
                        <p className="text-lg font-bold">Your Score: {calculateScore()} / {state.questions.length}</p>
                    </CardContent>
                </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
