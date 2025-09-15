
'use server';

import axios from 'axios';

const BKASH_API_URLS = {
  sandbox: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
  production: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
};

const API_URL = BKASH_API_URLS[process.env.BKASH_MODE === 'production' ? 'production' : 'sandbox'];

const getBkashToken = async (): Promise<string> => {
    try {
        const response = await axios.post(
            `${API_URL}/tokenized/checkout/token/grant`,
            {
                app_key: process.env.BKASH_APP_KEY,
                app_secret: process.env.BKASH_APP_SECRET,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    username: process.env.BKASH_USER_NAME,
                    password: process.env.BKASH_PASSWORD,
                },
            }
        );
        return response.data.id_token;
    } catch (error) {
        console.error("Error getting bKash token:", error);
        throw new Error("Failed to authenticate with bKash.");
    }
};

export const createBkashPayment = async (amount: number, orderId: string, planName: string) => {
    try {
        const token = await getBkashToken();
        const response = await axios.post(
            `${API_URL}/tokenized/checkout/create`,
            {
                mode: '0011',
                payerReference: orderId,
                callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/bkash/callback`,
                amount: amount.toString(),
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber: orderId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": token,
                    "X-App-Key": process.env.BKASH_APP_KEY,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error creating bKash payment:", error.response?.data || error.message);
        throw new Error("Failed to create bKash payment.");
    }
};

export const executeBkashPayment = async (paymentID: string) => {
     try {
        const token = await getBkashToken();
        const response = await axios.post(
            `${API_URL}/tokenized/checkout/execute`,
            { paymentID },
            {
                headers: {
                    "Authorization": token,
                    "X-App-Key": process.env.BKASH_APP_KEY,
                }
            }
        );
        return response.data;
    } catch (error: any) {
         console.error("Error executing bKash payment:", error.response?.data || error.message);
         throw new Error("Failed to execute bKash payment.");
    }
}
