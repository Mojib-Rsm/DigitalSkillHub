
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";
import { Bot, Sparkles, LogIn, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, onAuthStateChanged, signInWithCustomToken, User } from "firebase/auth";
import { app } from "@/lib/firebase";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full text-base" size="lg">
            {pending ? (
                <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                </>
            ) : (
                <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                </>
            )}
        </Button>
    );
}

export default function LoginPage() {
    const initialState = { message: "", issues: [], fields: {}, success: false, customToken: "" };
    const [state, formAction] = useActionState(loginAction, initialState);
    const { toast } = useToast();
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/dashboard');
            }
        });
        return () => unsubscribe();
    }, [auth, router]);

    useEffect(() => {
        if (state.success && state.customToken) {
            signInWithCustomToken(auth, state.customToken)
                .then((userCredential) => {
                    const user = userCredential.user;
                     toast({
                        title: "Login Successful!",
                        description: `Welcome back, ${user.displayName || user.email}.`,
                    });
                    router.push('/dashboard'); 
                })
                .catch((error) => {
                    console.error("Custom token sign-in error:", error.code, error.message);
                    toast({
                        variant: "destructive",
                        title: "Login Failed",
                        description: `Could not complete sign in. ${error.message}`,
                    });
                });
        } else if (!state.success && state.message && state.message !== "Validation Error") {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: state.message,
            });
        }
    }, [state, auth, toast, router]);
    
    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold font-headline">TotthoAi</span>
                    </Link>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        Log in to continue your content creation journey.
                    </p>
                </div>

                <Card className="shadow-2xl">
                     <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your credentials to access your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <Button variant="outline" className="py-6 text-base" type="button" disabled>
                                    <Chrome className="mr-2" /> Login with Google
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-grow border-t border-muted"></div>
                                <span className="mx-4 text-muted-foreground text-sm">OR</span>
                                <div className="flex-grow border-t border-muted"></div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required defaultValue={state.fields?.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Your password" required />
                            </div>
                            <SubmitButton/>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-6 border-t">
                        <p className="text-sm text-muted-foreground text-center w-full">
                            Don't have an account? <Link href="/free-trial" className="font-semibold text-primary hover:underline">Sign up for free</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
