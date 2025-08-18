
"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
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
import { getAuth, createUserWithEmailAndPassword, updateProfile, GithubAuthProvider, signInWithPopup, User } from "firebase/auth";
import { app } from "@/lib/firebase";


function SubmitButton({ onClick, isPending }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; isPending: boolean }) {
    const { pending } = useFormStatus();
    const disabled = pending || isPending;

    return (
        <Button type="submit" onClick={onClick} disabled={disabled} className="w-full text-base" size="lg">
            {disabled ? (
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
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (state.message === "success") {
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
                title: "Registration Failed",
                description: state.message,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    const handleFormSubmitWithEmail = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!formRef.current) return;
        const formData = new FormData(formRef.current);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || name.length < 3) {
            toast({ variant: "destructive", title: "Invalid Name", description: "Name must be at least 3 characters long." });
            return;
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
             toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
            return;
        }
        if (!password || password.length < 8) {
            toast({ variant: "destructive", title: "Invalid Password", description: "Password must be at least 8 characters long." });
            return;
        }

        const auth = getAuth(app);

        startTransition(async () => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                const idToken = await userCredential.user.getIdToken(true);
                
                const finalFormData = new FormData();
                finalFormData.append('name', name);
                finalFormData.append('email', email);
                finalFormData.append('idToken', idToken);
                
                formAction(finalFormData);

            } catch (error: any) {
                let description = "An unexpected error occurred.";
                if (error.code === 'auth/email-already-in-use') {
                    description = "This email address is already in use. Please log in instead.";
                } else if (error.message) {
                    description = error.message;
                }
                toast({
                    title: "Registration Failed",
                    description: description,
                    variant: "destructive",
                });
            }
        });
    };
    
    const handleGitHubSignUp = () => {
        const auth = getAuth(app);
        const provider = new GithubAuthProvider();
        provider.setCustomParameters({
            'client_id': "Ov23liHB5irTSxi9x4OK",
            'client_secret': "294df629c8df777d08bb90bac2487a6141919218",
        });
        
        startTransition(async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                const idToken = await user.getIdToken(true);
                
                const formData = new FormData();
                formData.append('name', user.displayName || user.email?.split('@')[0] || 'User');
                formData.append('email', user.email!);
                formData.append('idToken', idToken);
                formData.append('uid', user.uid);

                formAction(formData);

            } catch (error: any) {
                let description = "An unexpected error occurred during GitHub sign-up.";
                 if (error.code === 'auth/account-exists-with-different-credential') {
                    description = 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
                } else if (error.code === 'auth/unauthorized-domain') {
                    description = 'This domain is not authorized for OAuth operations. Please add it to the list of authorized domains in your Firebase console.'
                } else if (error.message) {
                    description = error.message;
                }
                toast({
                    title: "GitHub Sign-Up Failed",
                    description: description,
                    variant: "destructive",
                });
            }
        });
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
                                    Welcome aboard! You will be redirected to the dashboard shortly.
                                    <Button asChild className="mt-4 w-full">
                                        <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2"/></Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        ) : (
                        <form ref={formRef} className="space-y-6">
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
                            <div className="grid grid-cols-2 gap-4">
                                <Button type="button" variant="outline" className="py-6 text-base" disabled={isPending}>
                                    <Chrome className="mr-2" /> Sign up with Google
                                </Button>
                                <Button type="button" variant="outline" className="py-6 text-base" onClick={handleGitHubSignUp} disabled={isPending}>
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
                                <Input id="password" name="password" type="password" placeholder="Must be at least 8 characters" required minLength={8} defaultValue={state.fields?.password} />
                            </div>
                            <SubmitButton onClick={handleFormSubmitWithEmail} isPending={isPending} />
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
