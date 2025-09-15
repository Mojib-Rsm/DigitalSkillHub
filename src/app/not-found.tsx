
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { sendErrorNotification } from '@/services/email-service';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire-and-forget the email notification
    sendErrorNotification({ 
        error: new Error(`404 Not Found`),
        pathname: pathname,
    });
  }, [pathname]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <FileQuestion className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            The page you are looking for does not exist. It might have been moved or deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/">Go back to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
