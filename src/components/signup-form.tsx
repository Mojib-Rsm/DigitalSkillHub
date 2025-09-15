
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Sparkles } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signup, FormState } from "@/app/signup/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

function SignupButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" aria-disabled={pending}>
            {pending && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
        </Button>
    )
}

export default function SignupForm() {
    const initialState: FormState = { message: '', issues: {}, fields: {} };
    const [state, formAction] = useActionState(signup, initialState);

    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold font-headline">TotthoAi</span>
                    </Link>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Create an Account
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        Get started with your AI-powered toolkit.
                    </p>
                </div>

                <Card className="shadow-2xl">
                     <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Enter your information to create an account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form action={formAction} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="John Doe" required defaultValue={state.fields?.name} />
                                {state.issues?.name && <p className="text-sm font-medium text-destructive">{state.issues.name[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" required defaultValue={state.fields?.email} />
                                {state.issues?.email && <p className="text-sm font-medium text-destructive">{state.issues.email[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="userType">User Type</Label>
                                <Select name="userType" defaultValue={state.fields?.userType}>
                                    <SelectTrigger id="userType">
                                        <SelectValue placeholder="Select your primary role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="content_creator">Content Creator / Blogger</SelectItem>
                                        <SelectItem value="printing_shop">Printing Shop Owner</SelectItem>
                                        <SelectItem value="business_owner">Business Owner</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="general_user">General User</SelectItem>
                                    </SelectContent>
                                </Select>
                                {state.issues?.userType && <p className="text-sm font-medium text-destructive">{state.issues.userType[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                                {state.issues?.password && <p className="text-sm font-medium text-destructive">{state.issues.password[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                {state.issues?.confirmPassword && <p className="text-sm font-medium text-destructive">{state.issues.confirmPassword[0]}</p>}
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="terms" name="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I accept the <Link href="/legal/terms-of-service" className="underline">terms and conditions</Link>
                                </label>
                            </div>
                             {state.issues?.terms && <p className="text-sm font-medium text-destructive">{state.issues.terms[0]}</p>}


                            <SignupButton />
                            {state.message && state.message !== 'Validation Error' && state.message !== 'success' && (
                                <Alert variant="destructive">
                                    <AlertTitle>Registration Failed</AlertTitle>
                                    <AlertDescription>{state.message}</AlertDescription>
                                </Alert>
                            )}
                        </form>
                       
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
