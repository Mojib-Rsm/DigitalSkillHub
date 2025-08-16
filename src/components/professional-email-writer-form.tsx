
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { writeEmail } from "@/app/ai-tools/professional-email-writer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Mail } from "lucide-react";
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
          Writing...
        </>
      ) : (
        <>
          <Mail className="mr-2 h-5 w-5" />
          Write Email
        </>
      )}
    </Button>
  );
}

export default function ProfessionalEmailWriterForm() {
  const initialState = { message: "", emailDraft: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(writeEmail, initialState);
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
    if (state.emailDraft) {
      navigator.clipboard.writeText(state.emailDraft);
      toast({
        title: "Copied!",
        description: "Email draft copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Write a Professional Email</CardTitle>
        <CardDescription>
          Tell the AI what you want to say, and it will draft the email for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                    id="recipient"
                    name="recipient"
                    placeholder="e.g., Hiring Manager, Potential Client"
                    defaultValue={state.fields?.recipient}
                    required
                    />
                    {state.issues
                    ?.filter((issue) => issue.toLowerCase().includes("recipient"))
                    .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select name="tone" defaultValue={state.fields?.tone}>
                        <SelectTrigger id="tone">
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Persuasive">Persuasive</SelectItem>
                            <SelectItem value="Appreciative">Appreciative</SelectItem>
                        </SelectContent>
                    </Select>
                    {state.issues
                    ?.filter((issue) => issue.toLowerCase().includes("tone"))
                    .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of the Email</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="e.g., Follow up on a job application, inquire about a partnership, thank a client for their business."
              defaultValue={state.fields?.purpose}
              required
              rows={4}
            />
            {state.issues
              ?.filter((issue) => issue.toLowerCase().includes("purpose"))
              .map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {state.emailDraft && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Email Draft</h3>
            <Card className="bg-muted/50 relative">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">{state.emailDraft}</p>
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
