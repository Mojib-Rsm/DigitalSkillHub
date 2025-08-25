
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Database Seeding</h1>
        <p className="text-muted-foreground">
          Populate your Firestore database with initial demo data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seed Demo Data</CardTitle>
          <CardDescription>
            Click the button below to add demo collections and documents to your
            Firestore database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action may overwrite existing data if documents with the
              same IDs exist. This operation should only be performed on a new
              or empty database.
            </AlertDescription>
          </Alert>

          <form action={formAction}>
            <SubmitButton />
          </form>

          {state.message && !state.success && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state.success && state.message && (
             <Alert className="mt-4">
                <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
