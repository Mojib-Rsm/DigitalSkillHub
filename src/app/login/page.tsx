
"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loginAction } from "./actions";
import { Bot, Sparkles, LogIn, Github, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signInWithEmailAndPassword, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase";

function SubmitButton({isPending}: {isPending: boolean}) {
    const { pending } = useFormStatus();
    const disabled = pending || isPending;
    return (
        <Button type="submit" disabled={disabled} className="w-full text-base" size="lg">
            {disabled ? (
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
    const initialState = { message: "", issues: [], fields: {} };
    const [state, formAction] = useActionState(loginAction, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (state.message === "success") {
            toast({
                title: "Login Successful!",
                description: "Welcome back to TotthoAi. Redirecting to dashboard...",
            });
            window.location.href = "/dashboard";
        } else if (state.message && state.message !== "Validation Error") {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: state.message,
            });
        }
    }, [state, toast]);
    
    const handleSubmitWithEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Email and password are required.",
            });
            return;
        }
        
        startTransition(async () => {
            const auth = getAuth(app);
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredential.user.getIdToken();
                
                const finalFormData = new FormData();
                finalFormData.append('idToken', idToken);
                finalFormData.append('uid', userCredential.user.uid);
                finalFormData.append('email', userCredential.user.email!);
                finalFormData.append('name', userCredential.user.displayName || '');

                formAction(finalFormData);

            } catch (error: any) {
                 let description = "An unexpected error occurred. Please try again.";
                 if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    description = "Incorrect email or password. Please check your credentials and try again.";
                 } else if (error.message) {
                    description = error.message;
                 }
                 toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: description,
                });
            }
        });
    };
    
    const handleGitHubLogin = () => {
        const auth = getAuth(app);
        const provider = new GithubAuthProvider();
        provider.setCustomParameters({
            'client_id': process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
            'client_secret': process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
        });

        startTransition(async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                const idToken = await user.getIdToken(true);
                
                const formData = new FormData();
                formData.append('idToken', idToken);
                formData.append('uid', user.uid);
                formData.append('email', user.email!);
                formData.append('name', user.displayName || '');
                
                formAction(formData);

            } catch (error: any) {
                 let description = "An unexpected error occurred during GitHub sign-in.";
                 if (error.code === 'auth/account-exists-with-different-credential') {
                    description = 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
                } else if (error.code === 'auth/unauthorized-domain') {
                    description = 'This domain is not authorized for OAuth operations. Please add it to the list of authorized domains in your Firebase console.'
                } else if (error.message) {
                    description = error.message;
                }
                toast({
                    title: "GitHub Sign-In Failed",
                    description: description,
                    variant: "destructive",
                });
            }
        });
    };


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
                        <form ref={formRef} onSubmit={handleSubmitWithEmail} className="space-y-6">
                             {state.message && state.message !== "success" && state.message !== "Validation Error" &&(
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                       {state.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="py-6 text-base" type="button" disabled={isPending}>
                                    <Chrome className="mr-2" /> Login with Google
                                </Button>
                                <Button variant="outline" className="py-6 text-base" type="button" onClick={handleGitHubLogin} disabled={isPending}>
                                    <Github className="mr-2" /> Login with GitHub
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-grow border-t border-muted"></div>
                                <span className="mx-4 text-muted-foreground text-sm">OR</span>
                                <div className="flex-grow border-t border-muted"></div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required defaultValue={state.fields?.email} suppressHydrationWarning/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Your password" required />
                            </div>
                            <SubmitButton isPending={isPending} />
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
