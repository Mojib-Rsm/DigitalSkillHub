"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg text-center shadow-lg">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                    <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
                <CardTitle className="text-3xl font-bold">Something went wrong!</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                   We encountered an unexpected issue. Please try again.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button
                    size="lg"
                    onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                    }
                >
                    Try again
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
