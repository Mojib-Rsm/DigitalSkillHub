
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generatePost } from "@/app/ai-tools/social-media-post-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Hash } from "lucide-react";
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
          <Hash className="mr-2 h-5 w-5" />
          Generate Post
        </>
      )}
    </Button>
  );
}

export default function SocialMediaPostGeneratorForm() {
  const initialState = { message: "", post: "", issues: [], fields: {} };
  const [state, formAction] = useFormState(generatePost, initialState);
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
  
  const handleCopy = () => {
    if (state.post) {
      navigator.clipboard.writeText(state.post);
      toast({
        title: "Copied!",
        description: "Social media post copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Generate a Social Media Post</CardTitle>
        <CardDescription>
          Enter a topic and let AI craft the perfect post for your audience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Post Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g., Launching a new handmade jewelry collection"
              defaultValue={state.fields?.topic}
              required
            />
             {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("topic"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select name="platform" defaultValue={state.fields?.platform}>
                  <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  </SelectContent>
              </Select>
               {state.issues
                ?.filter((issue) => issue.toLowerCase().includes("platform"))
                .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
            <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" defaultValue={state.fields?.tone}>
                    <SelectTrigger id="tone">
                        <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                        <SelectItem value="Funny">Funny</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                    </SelectContent>
                </Select>
                 {state.issues
                  ?.filter((issue) => issue.toLowerCase().includes("tone"))
                  .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
            </div>
          </div>
          <SubmitButton />
        </form>

        {state.post && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Post</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.post}</p>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                    <Clipboard className="w-5 h-5"/>
                 </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
