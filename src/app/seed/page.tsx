"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { seedDatabaseAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Sparkles, AlertTriangle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full"
      variant="destructive"
    >
      {pending ? (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Seeding Database...
        </>
      ) : (
        <>
          <Database className="mr-2 h-5 w-5" />
          Seed Database
        </>
      )}
    </Button>
  );
}

export default function SeedDataPage() {
  const initialState = { success: false, message: "" };
  const [state, formAction] = useActionState(seedDatabaseAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.success ? "default" : "destructive",
        title: state.success ? "Success" : "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
            <h1 className="text-3xl font-bold text-center mb-2">Database Seeding</h1>
            <p className="text-muted-foreground text-center mb-6">
            Populate your MySQL database with initial demo data.
            </p>
            <Card>
                <CardHeader>
                <CardTitle>Seed Demo Data</CardTitle>
                <CardDescription>
                    Click the button below to add demo data to your MySQL database tables.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                    This action may not add data if tables are already populated. The seed script is designed to run on new or empty tables to prevent duplicates.
                    </AlertDescription>
                </Alert>

                <form action={formAction}>
                    <SubmitButton />
                </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
