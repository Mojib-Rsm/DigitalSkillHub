

"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { requestToolAction } from "@/app/request-a-tool/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" />
          Submit Request
        </>
      )}
    </Button>
  );
}

export default function RequestToolForm() {
  const initialState = { success: false, message: "" };
  const [state, formAction] = useActionState(requestToolAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Request Submitted!",
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
      }
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Describe Your Idea</CardTitle>
        <CardDescription>
          Provide as much detail as possible about the tool you'd like to see.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="tool_name">Tool Name</Label>
                <Input id="tool_name" name="tool_name" placeholder="e.g., 'Meeting Summarizer'" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="tool_description">Tool Description</Label>
                <Textarea id="tool_description" name="tool_description" placeholder="Describe what the tool should do, what inputs it takes, and what output it should produce." required rows={5}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="use_case">Example Use Case</Label>
                <Textarea id="use_case" name="use_case" placeholder="Describe a real-world scenario where this tool would be useful." required rows={3}/>
            </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
