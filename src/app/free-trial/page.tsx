
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signupAction, verifyAndCreateUserAction } from "./actions";
import { Bot, CheckCircle, Sparkles, Zap, ArrowRight, Lock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "@/lib/firebase";

function SignUpSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full text-base" size="lg">
            {pending ? (
                <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Sending OTP...
                </>
            ) : (
                <>
                    <Zap className="mr-2 h-5 w-5" />
                    Send Verification Code
                </>
            )}
        </Button>
    );
}

function OtpSubmitButton() {
    const { pending } = useFormStatus();
     return (
        <Button type="submit" disabled={pending} className="w-full text-base" size="lg">
            {pending ? (
                <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Verifying & Creating Account...
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
    const [signupState, signupFormAction] = useActionState(signupAction, { message: "", issues: [], fields: {}, step: "1", success: false });
    const [verifyState, verifyFormAction] = useActionState(verifyAndCreateUserAction, { message: "", success: false, customToken: "" });
    
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const auth = getAuth(app);
    
    const [formStep, setFormStep] = useState<"1" | "2" | "success">("1");

    useEffect(() => {
        if (signupState.step === "2" && signupState.success) {
            setFormStep("2");
            toast({
                title: "OTP Sent!",
                description: signupState.message,
                variant: "default",
            });
        } else if (signupState.message && signupState.message !== "Validation Error" && !signupState.success) {
            toast({
                title: "Registration Failed",
                description: signupState.message,
                variant: "destructive",
            });
        }
    }, [signupState, toast]);

    useEffect(() => {
        if (verifyState.success && verifyState.customToken) {
            signInWithCustomToken(auth, verifyState.customToken)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    const idToken = await user.getIdToken();
                    
                    // Set cookie
                    document.cookie = `firebaseIdToken=${idToken}; path=/; max-age=3600; samesite=lax`;

                    setFormStep("success");
                    toast({
                        title: "Account Created!",
                        description: "Welcome to TotthoAi. You will be redirected to the dashboard.",
                    });
                     const redirectUrl = searchParams.get('redirect') || '/dashboard';
                     router.push(redirectUrl);
                })
                .catch((error) => {
                     console.error("Custom token sign-in error:", error.code, error.message);
                    toast({
                        variant: "destructive",
                        title: "Login Failed",
                        description: `Could not complete sign in after verification. ${error.message}`,
                    });
                });
        } else if (verifyState.message && !verifyState.success) {
            toast({
                title: "Verification Failed",
                description: verifyState.message,
                variant: "destructive",
            });
        }
    }, [verifyState, toast, auth, router, searchParams]);

    
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
                        {formStep === "success" ? (
                             <Alert variant="default" className="border-green-500">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle className="text-green-700">Registration Successful!</AlertTitle>
                                <AlertDescription>
                                    Welcome aboard! You are being redirected to the dashboard.
                                    <Button asChild className="mt-4 w-full">
                                        <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2"/></Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        ) : (
                        <div className="space-y-6">
                            {signupState.issues && signupState.issues.length > 0 && formStep === '1' && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {signupState.issues?.map(issue => <li key={issue}>- {issue}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {formStep === '1' && (
                                <form action={signupFormAction} className="space-y-4">
                                     <input type="hidden" name="step" value="1" />
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" type="text" placeholder="e.g., Tanvir Ahmed" required defaultValue={signupState.fields?.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required defaultValue={signupState.fields?.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" name="password" type="password" placeholder="Must be at least 8 characters" required minLength={8} defaultValue={signupState.fields?.password}/>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" name="phone" type="tel" placeholder="01xxxxxxxxx" required className="pl-10" defaultValue={signupState.fields?.phone} />
                                        </div>
                                    </div>
                                    <SignUpSubmitButton/>
                                </form>
                            )}
                            
                            {formStep === '2' && (
                                <form action={verifyFormAction} className="space-y-4 animate-in fade-in-50">
                                    <input type="hidden" name="name" value={signupState.fields?.name || ''} />
                                    <input type="hidden" name="email" value={signupState.fields?.email || ''} />
                                    <input type="hidden" name="password" value={signupState.fields?.password || ''} />
                                    <input type="hidden" name="phone" value={signupState.fields?.phone || ''} />
                                    <div className="text-center">
                                        <p className="text-muted-foreground">An OTP has been sent to <strong>{signupState.fields?.phone}</strong>.</p>
                                        <p className="text-sm text-muted-foreground">Please enter the 6-digit code below.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Verification Code</Label>
                                        <Input id="otp" name="otp" type="text" placeholder="Enter the 6-digit code" required maxLength={6} autoFocus />
                                    </div>
                                    <OtpSubmitButton/>
                                    <Button variant="link" className="w-full" onClick={() => setFormStep("1")}>Back to registration</Button>
                                </form>
                            )}
                        </div>
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
