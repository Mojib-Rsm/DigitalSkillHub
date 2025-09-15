
import { NextResponse } from 'next/server';
import { executeBkashPayment } from '@/services/bkash-service';
import { getCurrentUser } from '@/services/user-service';

export async function GET(
    request: Request,
    { params }: { params: { paymentID: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const paymentID = params.paymentID;
        if (!paymentID) {
            return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
        }

        const executionResult = await executeBkashPayment(paymentID);

        // Here you would typically update the user's plan and credits in your database
        // For now, we just return the success message
        
        if (executionResult && executionResult.statusCode === '0000') {
             return NextResponse.json({ success: true, ...executionResult });
        } else {
            return NextResponse.json({ success: false, message: executionResult.errorMessage || "Payment execution failed." }, { status: 400 });
        }

    } catch (error) {
        const err = error as Error;
        console.error("bKash execute payment API error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
