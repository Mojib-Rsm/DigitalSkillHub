
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

function BkashCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [message, setMessage] = useState('Verifying your payment, please wait...');

    useEffect(() => {
        if (!paymentID || status !== 'success') {
            setVerificationStatus('failed');
            setMessage('Payment was not successful or is invalid.');
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await axios.get(`/api/bkash/payment/execute/${paymentID}`);

                if (response.data.success) {
                    setVerificationStatus('success');
                    setMessage(`Payment successful! Transaction ID: ${response.data.trxID}`);
                    // You can add logic here to update user's subscription/credits
                } else {
                    setVerificationStatus('failed');
                    setMessage(response.data.message || 'Payment verification failed.');
                }
            } catch (error) {
                setVerificationStatus('failed');
                setMessage('An error occurred during payment verification.');
                console.error(error);
            }
        };

        verifyPayment();
    }, [paymentID, status, router]);

    return (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-lg text-center shadow-lg">
                <CardHeader>
                    {verificationStatus === 'pending' && <Loader className="w-16 h-16 text-primary mx-auto animate-spin" />}
                    {verificationStatus === 'success' && <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />}
                    {verificationStatus === 'failed' && <XCircle className="w-16 h-16 text-destructive mx-auto" />}
                    <CardTitle className="text-3xl font-bold mt-4">Payment Status</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">{message}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/subscriptions">Go to Subscriptions</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}


export default function BkashCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BkashCallbackContent />
        </Suspense>
    );
}

