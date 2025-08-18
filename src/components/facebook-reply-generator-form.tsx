
"use client";

import React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateFacebookReplies } from "@/app/ai-tools/facebook-reply-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, CornerDownRight, PlusCircle, Trash2 } from "lucide-react";
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

type ConversationPart = {
    id: number;
    character: string;
    text: string;
}

export default function FacebookReplyGeneratorForm() {
  const initialState = { message: "", suggestions: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateFacebookReplies, initialState);
  const [conversationParts, setConversationParts] = useState<ConversationPart[]>([{ id: 1, character: "Character A", text: "" }]);
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

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "কপি করা হয়েছে!",
      description: "রিপ্লাইটি ক্লিপবোর্ডে কপি করা হয়েছে।",
    });
  };

  const addConversationPart = () => {
    setConversationParts(prev => [...prev, { id: Date.now(), character: "Me", text: "" }]);
  };

  const removeConversationPart = (id: number) => {
    setConversationParts(prev => prev.filter(part => part.id !== id));
  };
  
  const handleCharacterChange = (id: number, value: string) => {
    setConversationParts(prev => prev.map(part => part.id === id ? {...part, character: value} : part));
  }

  const handleTextChange = (id: number, value: string) => {
     setConversationParts(prev => prev.map(part => part.id === id ? {...part, text: value} : part));
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>কথোপকথনের রিপ্লাই তৈরি করুন</CardTitle>
        <CardDescription>
          আসল পোস্ট এবং কথোপকথনের প্রতিটি ধাপ ইনপুট দিন এবং "Me" চরিত্রের জন্য একটি প্রাসঙ্গিক রিপ্লাই পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="postContent">আসল পোস্টের বিষয়বস্তু</Label>
            <Textarea
              id="postContent"
              name="postContent"
              placeholder="আসল ফেসবুক পোস্টটি এখানে পেস্ট করুন..."
              defaultValue={state.fields?.postContent}
              rows={3}
              required
            />
            {state.issues?.filter((issue) => issue.toLowerCase().includes("পোস্ট")).map((issue) => <Alert key={issue} variant="destructive" className="mt-2"><AlertDescription>{issue}</AlertDescription></Alert>)}
          </div>
          
          <div className="space-y-4">
             <Label>কথোপকথনের ইতিহাস</Label>
             {conversationParts.map((part, index) => (
                <div key={part.id} className="p-4 border rounded-lg space-y-2 relative bg-muted/50">
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 items-start">
                        <Select name={`conversation[${index}].character`} defaultValue={part.character} onValueChange={(value) => handleCharacterChange(part.id, value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="চরিত্র নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Me">আমি (Me)</SelectItem>
                                <SelectItem value="Character A">চরিত্র A (পোস্ট লেখক)</SelectItem>
                                <SelectItem value="Character B">চরিত্র B</SelectItem>
                                <SelectItem value="Character C">চরিত্র C</SelectItem>
                            </SelectContent>
                        </Select>
                        <Textarea 
                            name={`conversation[${index}].text`}
                            placeholder={`চরিত্রের মন্তব্য লিখুন...`}
                            rows={2}
                            defaultValue={part.text}
                            onChange={(e) => handleTextChange(part.id, e.target.value)}
                        />
                    </div>
                     {conversationParts.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeConversationPart(part.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    )}
                </div>
             ))}
             {state.issues?.filter((issue) => issue.toLowerCase().includes("conversation")).map((issue) => <Alert key={issue} variant="destructive" className="mt-2"><AlertDescription>{issue}</AlertDescription></Alert>)}

             <Button type="button" variant="outline" onClick={addConversationPart} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4"/>
                কথোপকথন যোগ করুন
             </Button>
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
