
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signupAction } from "./actions";
import { Bot, CheckCircle, Sparkles, Zap, ArrowRight, Github, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full text-base" size="lg">
            {pending ? (
                <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                </>
            ) : (
                <>
                    <Zap className="mr-2 h-5 w-5" />
                    Start Writing for Free
                </>
            )}
        </Button>
    );
}

export default function FreeTrialPage() {
    const initialState = { message: "", issues: [], fields: {} };
    const [state, formAction] = useActionState(signupAction, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === "success") {
            toast({
                title: "Account Created!",
                description: "Welcome to TotaPakhi AI. You can now log in.",
                variant: "default",
            });
        }
    }, [state, toast]);


    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                 <div className="text-center mb-8">
                    <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold font-headline">TotaPakhi AI</span>
                    </Link>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Start Your Free Trial
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        No credit card required. Instantly access all features.
                    </p>
                </div>

                <Card className="shadow-2xl">
                    <CardContent className="p-8">
                        {state.message === "success" ? (
                             <Alert variant="default" className="border-green-500">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle className="text-green-700">Registration Successful!</AlertTitle>
                                <AlertDescription>
                                    Welcome aboard! You can now log in to your dashboard and start creating content.
                                    <Button asChild className="mt-4 w-full">
                                        <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2"/></Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        ) : (
                        <form action={formAction} className="space-y-6">
                             {state.message === "Validation Error" && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {state.issues?.map(issue => <li key={issue}>- {issue}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="py-6 text-base">
                                    <Chrome className="mr-2" /> Sign up with Google
                                </Button>
                                <Button variant="outline" className="py-6 text-base">
                                    <Github className="mr-2" /> Sign up with GitHub
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-grow border-t border-muted"></div>
                                <span className="mx-4 text-muted-foreground text-sm">OR</span>
                                <div className="flex-grow border-t border-muted"></div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" type="text" placeholder="e.g., Tanvir Ahmed" required defaultValue={state.fields?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required defaultValue={state.fields?.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Must be at least 8 characters" required defaultValue={state.fields?.password} />
                            </div>
                            <SubmitButton />
                        </form>
                        )}
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-6 border-t">
                        <p className="text-sm text-muted-foreground text-center w-full">
                            Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log in here</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
