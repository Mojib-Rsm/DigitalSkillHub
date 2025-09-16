
'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import pool from '@/lib/db';
import ImageKit from 'imagekit';
import { revalidatePath } from 'next/cache';


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


const PaymentProofSchema = z.object({
    planId: z.string(),
    amount: z.coerce.number(),
    paymentMethod: z.enum(['bKash', 'Nagad']),
    senderNumber: z.string().min(11, "Please enter a valid phone number."),
    transactionId: z.string().min(5, "Please enter a valid transaction ID."),
    screenshot: z.any().optional(),
});


export async function submitPaymentProofAction(prevState: any, formData: FormData): Promise<{success: boolean, message: string}> {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: "You must be logged in to submit payment proof." };
    }

    const validatedFields = PaymentProofSchema.safeParse({
        planId: formData.get('planId'),
        amount: formData.get('amount'),
        paymentMethod: formData.get('paymentMethod'),
        senderNumber: formData.get('senderNumber'),
        transactionId: formData.get('transactionId'),
        screenshot: formData.get('screenshot'),
    });

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.errors.map(e => e.message).join(', ') };
    }

    try {
        const { planId, amount, paymentMethod, senderNumber, transactionId, screenshot } = validatedFields.data;
        let screenshotUrl = null;

        if (screenshot && screenshot.size > 0) {
            const photoBuffer = Buffer.from(await screenshot.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: photoBuffer,
                fileName: `${user.id}_${planId}_${Date.now()}_${screenshot.name}`,
                folder: '/totthoai/payment_screenshots',
            });
            screenshotUrl = uploadResponse.url;
        }

        await pool.query(
            `INSERT INTO transactions (user_id, plan_id, amount, status, method, sender_number, transaction_id, screenshot_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [user.id, planId, amount, 'Pending', paymentMethod, senderNumber, transactionId, screenshotUrl]
        );
        
        revalidatePath('/dashboard/admin/transactions');

        return { success: true, message: "Your payment proof has been submitted successfully. Please wait for admin approval." };
    } catch (error) {
        console.error("Error submitting payment proof:", error);
        return { success: false, message: "An unexpected error occurred. Please try again later." };
    }
}
