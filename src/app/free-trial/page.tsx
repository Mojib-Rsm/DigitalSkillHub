
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signupAction } from "./actions";
import { Bot, CheckCircle, Sparkles, Zap, ArrowRight, Lock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton({ step }: { step: "1" | "2" }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full text-base" size="lg">
            {pending ? (
                <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    {step === "1" ? "Sending OTP..." : "Verifying & Creating Account..."}
                </>
            ) : step === "1" ? (
                <>
                    <Zap className="mr-2 h-5 w-5" />
                    Send Verification Code
                </>
            ) : (
                <>
                    <Lock className="mr-2 h-5 w-5" />
                    Create Account
                </>
            )}
        </Button>
    );
}

export default function FreeTrialPage() {
    const initialState = { message: "", issues: [], fields: {}, step: "1" as "1" | "2" };
    const [state, formAction] = useActionState(signupAction, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.step === "success") {
            toast({
                title: "Account Created!",
                description: "Welcome to TotthoAi. You will be redirected to the dashboard.",
                variant: "default",
            });
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);
        } else if (state.message && state.message !== "Validation Error") {
            toast({
                title: state.step === "2" ? "OTP Sent" : "Registration Failed",
                description: state.message,
                variant: state.step === "2" ? "default" : "destructive",
            });
        }
    }, [state, toast]);

    const isOtpStep = state.step === "2";
    
    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                 <div className="text-center mb-8">
                    <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold font-headline">TotthoAi</span>
                    </Link>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Start Your Free Trial
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        No credit card required. Verify your phone number to get started.
                    </p>
                </div>

                <Card className="shadow-2xl">
                    <CardContent className="p-8">
                        {state.step === "success" ? (
                             <Alert variant="default" className="border-green-500">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle className="text-green-700">Registration Successful!</AlertTitle>
                                <AlertDescription>
                                    Welcome aboard! You will be redirected to the dashboard shortly.
                                    <Button asChild className="mt-4 w-full">
                                        <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2"/></Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        ) : (
                        <form ref={formRef} action={formAction} className="space-y-6">
                             {state.issues && state.issues.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {state.issues?.map(issue => <li key={issue}>- {issue}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                            <input type="hidden" name="step" value={isOtpStep ? "2" : "1"} />
                            <input type="hidden" name="name" value={state.fields?.name || ""} />
                            <input type="hidden" name="email" value={state.fields?.email || ""} />
                            <input type="hidden" name="password" value={state.fields?.password || ""} />
                            <input type="hidden" name="phone" value={state.fields?.phone || ""} />

                            <div className={isOtpStep ? "hidden" : "space-y-4"}>
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
                                    <Input id="password" name="password" type="password" placeholder="Must be at least 8 characters" required minLength={8} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" name="phone" type="tel" placeholder="01xxxxxxxxx" required defaultValue={state.fields?.phone} className="pl-10" />
                                    </div>
                                </div>
                            </div>
                            
                            {isOtpStep && (
                                <div className="space-y-2 animate-in fade-in-50">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <Input id="otp" name="otp" type="text" placeholder="Enter the 6-digit code" required maxLength={6} />
                                </div>
                            )}

                            <SubmitButton step={isOtpStep ? "2" : "1"} />
                            {isOtpStep && (
                                <Button variant="link" className="w-full" onClick={() => window.location.reload()}>Back to registration</Button>
                            )}
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
