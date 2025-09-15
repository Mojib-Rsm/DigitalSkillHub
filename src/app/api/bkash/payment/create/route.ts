
import { NextResponse } from 'next/server';
import { createBkashPayment } from '@/services/bkash-service';
import { getCurrentUser } from '@/services/user-service';

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { amount, planName } = await request.json();

        if (!amount || !planName) {
            return NextResponse.json({ error: 'Amount and planName are required' }, { status: 400 });
        }
        
        const orderId = `TTH-ORD-${Date.now()}`;

        const paymentData = await createBkashPayment(amount, orderId, planName);

        if (paymentData && paymentData.bkashURL) {
            return NextResponse.json({ bkashURL: paymentData.bkashURL });
        } else {
             return NextResponse.json({ error: paymentData.errorMessage || "Failed to create payment URL." }, { status: 500 });
        }

    } catch (error) {
        const err = error as Error;
        console.error("bKash create payment API error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
