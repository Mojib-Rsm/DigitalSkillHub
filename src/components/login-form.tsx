
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Sparkles, LogIn, Chrome, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginAction } from "@/app/login/actions";

function LoginSubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button type="submit" disabled={isSubmitting} className="w-full text-base" size="lg">
            {isSubmitting ? (
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

export default function LoginForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        
        // The action will handle the redirect on success, so we only care about the error case here.
        try {
            const result = await loginAction(formData);
            if (!result.success) {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: result.message,
                });
            }
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Login Error",
                description: "An unexpected error occurred during login."
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4" suppressHydrationWarning={true}>
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
                    <CardContent className="p-8">
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                                <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Your password" required />
                            </div>
                             <LoginSubmitButton isSubmitting={isSubmitting} />
                        </form>
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-6 border-t">
                        <p className="text-sm text-muted-foreground text-center w-full">
                            Don't have an account? <Link href="/free-trial" className="font-semibold text-primary hover:underline">Sign up for free</Link>
                        </p>
                    </CardFooter>
                </Card>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex items-center text-base"><Info className="w-5 h-5 mr-2 text-primary"/>Demo Account Info</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div>
                            <p className="font-semibold">Admin User:</p>
                            <p className="text-muted-foreground">Email: <span className="font-mono">admin@totthoai.com</span></p>
                            <p className="text-muted-foreground">Password: <span className="font-mono">adminpassword</span></p>
                        </div>
                         <div>
                            <p className="font-semibold">Regular User:</p>
                            <p className="text-muted-foreground">Email: <span className="font-mono">user@totthoai.com</span></p>
                            <p className="text-muted-foreground">Password: <span className="font-mono">userpassword</span></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
