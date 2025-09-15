
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { checkDbConnection } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Server, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Testing...
        </>
      ) : (
        <>
          <Server className="mr-2 h-5 w-5" />
          Test Connection
        </>
      )}
    </Button>
  );
}

export default function DbStatusPage() {
  const initialState = { success: false, message: "" };
  const [state, formAction] = useActionState(checkDbConnection, initialState);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Database Status</h1>
        <p className="text-muted-foreground text-center mb-6">
          Check the connectivity status of your MySQL database.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>
              Click the button below to verify that the application can
              successfully connect to the database configured in your `.env` file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="max-w-xs mx-auto">
              <SubmitButton />
            </form>

            {state.message && (
                  <div className="mt-6">
                      <Alert variant={state.success ? "default" : "destructive"}>
                          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                          <AlertTitle>{state.success ? "Success" : "Connection Failed"}</AlertTitle>
                          <AlertDescription>{state.message}</AlertDescription>
                      </Alert>
                  </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
