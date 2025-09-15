
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';
import { forgotPasswordAction } from '@/app/forgot-password/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending}>
      {pending && <Sparkles className="mr-2 h-4 w-4 animate-spin" />}
      Send Reset Link
    </Button>
  );
}

export default function ForgotPasswordForm() {
  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>Enter your email address to receive a reset link.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>

          {state.message && (
            <Alert variant={state.success ? 'default' : 'destructive'}>
                {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <AlertTitle>{state.success ? 'Check Your Email' : 'Error'}</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
           <div className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Back to Sign In
                </Link>
            </div>
        </CardFooter>
      </form>
    </Card>
  );
}
