
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, DatabaseZap, Loader, XCircle } from "lucide-react";
import { seedDatabase } from "@/services/seed-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function SeedDataPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

    const handleSeed = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const seedResult = await seedDatabase();
            setResult(seedResult);
            if (seedResult.success) {
                toast({
                    title: "Database Seeding Successful!",
                    description: seedResult.message,
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Database Seeding Failed",
                    description: seedResult.message,
                });
            }
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
             setResult({ success: false, message: errorMessage });
             toast({
                variant: "destructive",
                title: "Database Seeding Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
       <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: Database Seeding</h1>
                <p className="text-muted-foreground">
                    Use this page to populate your Firestore database with the initial demo data.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Seed Firestore Database</CardTitle>
                    <CardDescription>
                       Clicking the button below will add demo data for courses, blog posts, testimonials, jobs, pricing plans, and users to your Firestore database. This action should only be performed once.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeed} disabled={isLoading} size="lg">
                        {isLoading ? (
                            <>
                                <Loader className="mr-2 h-5 w-5 animate-spin" />
                                Seeding in progress...
                            </>
                        ) : (
                            <>
                                <DatabaseZap className="mr-2 h-5 w-5" />
                                Start Database Seeding
                            </>
                        )}
                    </Button>

                    {result && (
                        <Alert className="mt-6" variant={result.success ? "default" : "destructive"}>
                            {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>
                                {result.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    