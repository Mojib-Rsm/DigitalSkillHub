
import { Bot } from "lucide-react";
import Link from "next/link";
import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold font-headline">TotthoAi</span>
                    </Link>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                        Forgot Your Password?
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3">
                        No problem. Enter your email below and we'll send you a link to reset it.
                    </p>
                </div>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}
