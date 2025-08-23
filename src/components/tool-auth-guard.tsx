
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader, Lock } from "lucide-react";
import { getCurrentUser, UserProfile } from "@/services/user-service";

export default function ToolAuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Failed to check auth status:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    checkAuth();
  }, [pathname]); // Re-check on path change

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader className="w-8 h-8 animate-spin text-primary"/>
            <p className="text-muted-foreground">Authenticating...</p>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="mt-12 bg-muted/50 max-w-lg mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                        <Lock className="w-8 h-8 text-primary"/>
                    </div>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>
                        You must be logged in to use this tool.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href={`/login?redirect=${pathname}`}>Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/signup">Create an Account</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return <>{children}</>;
}
