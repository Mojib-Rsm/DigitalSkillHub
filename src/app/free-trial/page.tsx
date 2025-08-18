
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signupAction, verifyOtpAction } from "./actions";
import { Bot, CheckCircle, Sparkles, Zap, ArrowRight, Lock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import crypto from "crypto";

// This is a placeholder for a more secure hashing mechanism.
// In a real app, you would use a library like bcrypt.js
// or PBKDF2 for password hashing.
function simpleHash(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}


function SubmitButton({ step }: { step: "1" | "2" }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full text-base" size="lg">
            {pending ? (
                <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    {step === "1" ? "Sending OTP..." : "Verifying..."}
                </>
            ) : step === "1" ? (
                <>
                    <Zap className="mr-2 h-5 w-5" />
                    Send Verification Code
                </>
            ) : (
                <>
                    <Lock className="mr-2 h-5 w-5" />
                    Verify & Create Account
                </>
            )}
        </Button>
    );
}

export default function FreeTrialPage() {
    const initialState = { message: "", issues: [], fields: {}, step: "1" as "1" | "2", success: false };
    const [state, formAction] = useActionState(signupAction, initialState);
    const [isVerifying, setIsVerifying] = useState(false);
    
    const { toast } = useToast();
    
    const [name, setName] = useState(state.fields?.name || '');
    const [email, setEmail] = useState(state.fields?.email || '');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(state.fields?.phone || '');
    const [otp, setOtp] = useState('');

    const [formStep, setFormStep] = useState<"1" | "2" | "success">("1");

    useEffect(() => {
        if (state.step === "2" && state.success) {
            setFormStep("2");
            toast({
                title: "OTP Sent!",
                description: state.message,
                variant: "default",
            });
        } else if (state.message && state.message !== "Validation Error" && !state.success) {
            toast({
                title: "Registration Failed",
                description: state.message,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!email || !otp) {
            toast({ title: "Error", description: "Email and OTP are required.", variant: "destructive"});
            return;
        }
        setIsVerifying(true);

        const verifyResult = await verifyOtpAction(email, otp);

        if (verifyResult.success) {
            try {
                const db = getFirestore(app);
                const uid = crypto.randomUUID();
                
                await setDoc(doc(db, "users", uid), {
                    uid,
                    name,
                    email,
                    phone,
                    password: simpleHash(password), // Hashing the password before storing
                    createdAt: new Date().toISOString(),
                });

                toast({
                    title: "Account Created!",
                    description: "Welcome to TotthoAi. You will be redirected to the dashboard.",
                });
                setFormStep("success");
                 setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);

            } catch (dbError) {
                console.error("Firestore write error:", dbError);
                toast({
                    title: "Database Error",
                    description: "Could not save your account information. Please try again.",
                    variant: "destructive",
                });
            }
        } else {
             toast({
                title: "OTP Verification Failed",
                description: verifyResult.message,
                variant: "destructive",
            });
        }

        setIsVerifying(false);
    };
    
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
                                    Welcome aboard! You will be redirected to the dashboard shortly.
                                    <Button asChild className="mt-4 w-full">
                                        <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2"/></Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        ) : (
                        <div className="space-y-6">
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

                            {formStep === '1' && (
                                <form action={formAction} className="space-y-4">
                                     <input type="hidden" name="step" value="1" />
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" type="text" placeholder="e.g., Tanvir Ahmed" required value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" name="password" type="password" placeholder="Must be at least 8 characters" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}/>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" name="phone" type="tel" placeholder="01xxxxxxxxx" required className="pl-10" value={phone} onChange={e => setPhone(e.target.value)} />
                                        </div>
                                    </div>
                                    <SubmitButton step="1" />
                                </form>
                            )}
                            
                            {formStep === '2' && (
                                <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in-50">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Verification Code</Label>
                                        <Input id="otp" name="otp" type="text" placeholder="Enter the 6-digit code" required maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} />
                                    </div>
                                    <Button type="submit" disabled={isVerifying} className="w-full text-base" size="lg">
                                        {isVerifying ? (
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
