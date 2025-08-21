
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Sparkles, DatabaseZap } from "lucide-react";
import { seedDataAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Seeding Database...
        </>
      ) : (
        <>
          <DatabaseZap className="mr-2 h-5 w-5" />
          Start Database Seeding
        </>
      )}
    </Button>
  );
}

export default function SeedDataPage() {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(seedDataAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle>Seed Demo Database</CardTitle>
                <CardDescription>
                    Click the button below to populate your Firestore database with demo data.
                    This includes courses, blog posts, jobs, pricing plans, and testimonials.
                    <br/>
                    <strong className="text-destructive mt-2 block">Warning: This is a destructive operation and should only be run once on a clean database.</strong>
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form action={formAction}>
                    <SubmitButton />
                </form>

                {state.success && (
                    <Alert className="mt-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Seeding Complete!</AlertTitle>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                    </Alert>
                )}
                 {!state.success && state.message && (
                    <Alert variant="destructive" className="mt-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Seeding Failed</AlertTitle>
                        <AlertDescription>
                            {state.message}
                        </AlertDescription>
                    </Alert>
                )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
