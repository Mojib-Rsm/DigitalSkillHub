
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendNotificationAction } from "./actions";
import { Sparkles, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTools, Tool } from "@/services/tool-service";

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
          Send Notification
        </>
      )}
    </Button>
  );
}


export default function NotificationsPage() {
    const initialState = { success: false, message: "" };
    const [state, formAction] = useActionState(sendNotificationAction, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [tools, setTools] = useState<Tool[]>([]);
    const [loadingTools, setLoadingTools] = useState(true);

    useEffect(() => {
        const fetchTools = async () => {
            const allTools = await getTools();
            setTools(allTools);
            setLoadingTools(false);
        };
        fetchTools();
    }, []);

    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? "default" : "destructive",
                title: state.success ? "Success" : "Error",
                description: state.message,
            });
            if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Send Notification</h1>
                <p className="text-muted-foreground">
                    Compose and send a new announcement to all users or for a specific tool.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Compose Message</CardTitle>
                    <CardDescription>
                       The message will appear as an in-app notification.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="toolId">Target Audience</Label>
                             <Select name="toolId" defaultValue="all">
                                <SelectTrigger id="toolId" disabled={loadingTools}>
                                    <SelectValue placeholder="Select a target..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <optgroup label="Specific Tools">
                                        {tools.map(tool => (
                                            <SelectItem key={tool.id} value={tool.id}>{tool.title}</SelectItem>
                                        ))}
                                    </optgroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                            id="title"
                            name="title"
                            placeholder="e.g., New Feature Announcement!"
                            required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                            id="message"
                            name="message"
                            placeholder="Describe the new feature or announcement in detail..."
                            required
                            rows={8}
                            />
                        </div>

                         {!state.success && state.message && (
                            <Alert variant="destructive">
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}

                        <SubmitButton/>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
