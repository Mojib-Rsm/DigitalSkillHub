
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Sparkles, Zap, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signupAction } from "./actions";

function SignUpSubmitButton() {
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
                    Create Free Account
                </>
            )}
        </Button>
    );
}

export default function FreeTrialPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const initialState = { message: "", success: false, issues: [], fields: {} };
    const [state, formAction] = useActionState(signupAction, initialState);

    if (state.success) {
        toast({
            title: "Account Created!",
            description: "Welcome to TotthoAi. You will be redirected to the dashboard.",
        });
        const redirectUrl = searchParams.get('redirect') || '/dashboard';
        router.push(redirectUrl);
    } else if (state.message && state.message !== 'Validation Error') {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: state.message,
        });
    }
    
    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold font-headline">TotthoAi</span>
                    </Link>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Start Your Free Trial
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        No credit card required. Just sign up to get started.
                    </p>
                </div>

                <Card className="shadow-2xl">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                             {state.message === 'Validation Error' && state.issues && state.issues.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc pl-5">
                                            {state.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                            <form action={formAction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" type="text" placeholder="e.g., Tanvir Ahmed" required defaultValue={state.fields?.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required defaultValue={state.fields?.email}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" placeholder="Must be at least 8 characters" required minLength={8} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" name="phone" type="tel" placeholder="01xxxxxxxxx" required className="pl-10" defaultValue={state.fields?.phone} />
                                    </div>
                                </div>
                                <SignUpSubmitButton />
                            </form>
                        </div>
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
