
"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { contactSupportAction } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" />
          Send Message
        </>
      )}
    </Button>
  );
}

export default function ContactForm() {
  const initialState = { message: "", reply: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(contactSupportAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
      toast({
        title: "Message Sent!",
        description: "We have received your message and will get back to you shortly.",
      });
    } else if (state.message && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" name="name" placeholder="e.g., John Doe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" name="email" type="email" placeholder="e.g., john@example.com" required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="How can we help?" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your detailed message..." required rows={6}/>
            </div>
            {state.issues && state.issues.length > 0 && (
                 <Alert variant="destructive">
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {state.issues.map(issue => <li key={issue}>{issue}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
          <SubmitButton />
        </form>

        {state.reply && (
          <div className="mt-8">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Message Sent!</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">Here is an initial AI-generated response:</p>
                <p className="mt-2 text-muted-foreground">{state.reply}</p>
                 <p className="mt-2 text-xs">Our human support team will get back to you shortly if needed.</p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
