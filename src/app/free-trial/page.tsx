
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Sparkles, Zap, Lock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function SignUpSubmitButton({ loading }: { loading: boolean }) {
    return (
        <Button type="submit" disabled={loading} className="w-full text-base" size="lg">
            {loading ? (
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
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user info to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: user.email,
                phone: phone,
                createdAt: new Date().toISOString()
            });

            const idToken = await user.getIdToken();
            document.cookie = `firebaseIdToken=${idToken}; path=/; max-age=3600; samesite=lax`;

            toast({
                title: "Account Created!",
                description: "Welcome to TotthoAi. You will be redirected to the dashboard.",
            });
            const redirectUrl = searchParams.get('redirect') || '/dashboard';
            router.push(redirectUrl);

        } catch (err: any) {
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "This email address is already in use by another account.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address.";
            }
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
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
                        Start Your Free Trial
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        No credit card required. Just sign up to get started.
                    </p>
                </div>

                <Card className="shadow-2xl">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" type="text" placeholder="e.g., Tanvir Ahmed" required value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" placeholder="e.g., yourname@example.com" required value={email} onChange={e => setEmail(e.target.value)}/>
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
                                <SignUpSubmitButton loading={loading} />
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
