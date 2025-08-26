
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('redirect') || '/dashboard';

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
                        <CardDescription>Use your Google account to sign in securely.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                         <Button 
                            variant="outline" 
                            className="w-full py-6 text-base" 
                            type="button" 
                            onClick={() => signIn('google', { callbackUrl })}
                        >
                            <Chrome className="mr-2" /> Login with Google
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
