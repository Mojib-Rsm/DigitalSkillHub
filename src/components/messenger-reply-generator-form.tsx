
"use client";

import React from "react";
import { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateMessengerReplies } from "@/app/ai-tools/messenger-reply-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, MessageCircle, PlusCircle, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import Image from "next/image";

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
          <MessageCircle className="mr-2 h-5 w-5" />
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

export default function MessengerReplyGeneratorForm() {
  const initialState = { message: "", suggestions: [], issues: [], fields: {} };
  const [state, formAction] = useActionState(generateMessengerReplies, initialState);
  const [conversationParts, setConversationParts] = useState<ConversationPart[]>([
    { id: Date.now(), character: "Friend", text: "" },
  ]);
  const [selectedGoal, setSelectedGoal] = useState(initialState.fields?.goal || "");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
     if (state.message && state.message !== "success" && state.message !== "Validation Error") {
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
    const nextCharacter = conversationParts.length > 0 && conversationParts[conversationParts.length - 1].character === "Me" ? "Friend" : "Me";
    setConversationParts(prev => [...prev, { id: Date.now(), character: nextCharacter, text: "" }]);
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

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
          toast({ variant: "destructive", title: "ফাইল খুবই বড়", description: "ছবির আকার 4MB এর বেশি হতে পারবে না।" });
          if (fileInputRef.current) fileInputRef.current.value = "";
          setPreviewUrl(null);
          return;
      }
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLFormElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if(file && fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
                handleFileChange(file);
                event.preventDefault();
            }
            break;
        }
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>কথোপকথনের রিপ্লাই তৈরি করুন</CardTitle>
        <CardDescription>
          কথোপকথনের প্রতিটি ধাপ ইনপুট দিন বা স্ক্রিনশট আপলোড করুন এবং "Me" চরিত্রের জন্য একটি প্রাসঙ্গিক রিপ্লাই পান।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} onPaste={handlePaste} className="space-y-6">
          <div className="space-y-4">
             <Label>কথোপকথনের ইতিহাস (ঐচ্ছিক যদি স্ক্রিনশট থাকে)</Label>
             {conversationParts.map((part, index) => (
                <div key={part.id} className="p-4 border rounded-lg space-y-2 relative bg-muted/50">
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 items-start">
                        <Select name={`conversation[${index}].character`} defaultValue={part.character} onValueChange={(value) => handleCharacterChange(part.id, value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="চরিত্র নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Me">আমি (Me)</SelectItem>
                                <SelectItem value="Friend">বন্ধু</SelectItem>
                                <SelectItem value="Family">পরিবার</SelectItem>
                                <SelectItem value="Colleague">সহকর্মী</SelectItem>
                                <SelectItem value="Other Person">অন্যান্য ব্যক্তি</SelectItem>
                            </SelectContent>
                        </Select>
                        <Textarea 
                            name={`conversation[${index}].text`}
                            placeholder={`ব্যক্তির মেসেজ লিখুন...`}
                            rows={2}
                            defaultValue={part.text}
                            onChange={(e) => handleTextChange(part.id, e.target.value)}
                        />
                    </div>
                     {conversationParts.length > 0 && (
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

           <div className="space-y-2">
            <Label htmlFor="photo">স্ক্রিনশট আপলোড করুন বা পেস্ট করুন (ঐচ্ছিক, সর্বোচ্চ 4MB)</Label>
            <Input id="photo" name="photo" type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            {previewUrl && (
                <div className="mt-2 relative w-full h-48 border rounded-md">
                    <Image src={previewUrl} alt="Screenshot preview" fill className="rounded-md object-contain p-2"/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => handleFileChange(null)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full">
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
             {state.issues?.filter((issue) => issue.toLowerCase().includes("ছবি")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">আপনার লক্ষ্য (ঐচ্ছিক)</Label>
            <Select name="goal" defaultValue={state.fields?.goal as string} onValueChange={setSelectedGoal}>
                <SelectTrigger id="goal">
                    <SelectValue placeholder="একটি লক্ষ্য নির্বাচন করুন..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="end the conversation politely">ভদ্রভাবে কথোপকথন শেষ করুন</SelectItem>
                    <SelectItem value="ask a clarifying question">একটি স্পষ্টীকরণের জন্য প্রশ্ন জিজ্ঞাসা করুন</SelectItem>
                    <SelectItem value="be supportive and encouraging">সহানুভূতিশীল এবং উৎসাহব্যঞ্জক হন</SelectItem>
                    <SelectItem value="provide helpful information">সহায়ক তথ্য প্রদান করুন</SelectItem>
                    <SelectItem value="reply with humor">রসিকতার সাথে উত্তর দিন</SelectItem>
                    <SelectItem value="show interest">আগ্রহ দেখান</SelectItem>
                    <SelectItem value="Other">অন্যান্য (লিখুন)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          
          {selectedGoal === 'Other' && (
            <div className="space-y-2 animate-in fade-in-50">
                <Label htmlFor="customGoal">আপনার নিজের লক্ষ্য লিখুন</Label>
                <Input
                    id="customGoal"
                    name="customGoal"
                    placeholder="আপনার লক্ষ্য এখানে লিখুন..."
                    defaultValue={state.fields?.customGoal}
                />
                 {state.issues?.filter((issue) => issue.toLowerCase().includes("customgoal")).map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
           )}
          
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
