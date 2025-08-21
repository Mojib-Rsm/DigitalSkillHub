
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { AlertCircle, Lock } from "lucide-react";

export default function ToolAuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
        </div>
    );
  }

  if (!user) {
    return (
        <Card className="mt-12 bg-muted/50">
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
                    <Link href="/free-trial">Create an Account</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return <>{children}</>;
}
