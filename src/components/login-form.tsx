
"use client";

import { Suspense } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Chrome, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useActionState } from 'react';
import { authenticate } from '@/app/login/actions';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Checkbox } from './ui/checkbox';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" aria-disabled={pending}>
            {pending && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
        </Button>
    )
}

function LoginFormContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('redirect') || '/dashboard';
    const [errorMessage, formAction] = useActionState(authenticate, undefined);

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
                        Sign in to continue to your dashboard.
                    </p>
                </div>

                <Card className="shadow-2xl">
                     <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your email and password below to log in.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form action={formAction} className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                            </div>
                             <div className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                     <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="remember-me" />
                                <label
                                    htmlFor="remember-me"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>
                            <LoginButton />
                            {errorMessage && (
                                <Alert variant="destructive">
                                    <AlertTitle>Login Failed</AlertTitle>
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}
                        </form>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                         <Button 
                            variant="outline" 
                            className="w-full" 
                            type="button" 
                            onClick={() => signIn('google', { callbackUrl })}
                        >
                            <Chrome className="mr-2" /> Sign In with Google
                        </Button>

                         <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-semibold text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


export default function LoginForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginFormContent />
        </Suspense>
    );
}
