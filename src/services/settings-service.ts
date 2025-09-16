
'use server';

import pool from '@/lib/db';

export type PaymentMethod = {
    method: 'bKash' | 'Nagad';
    number: string;
    type: string;
};

async function getSetting(key: string): Promise<any | null> {
    try {
        const result = await pool.query('SELECT setting_value FROM settings WHERE setting_key = $1', [key]);
        if (result.rows.length > 0) {
            return result.rows[0].setting_value;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching setting '${key}' from PostgreSQL:`, error);
        return null;
    }
}

async function updateSetting(key: string, value: any): Promise<void> {
    await pool.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2',
        [key, value]
    );
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const bkash = await getSetting('payment_method_bkash');
    const nagad = await getSetting('payment_method_nagad');

    const methods: PaymentMethod[] = [];
    if (bkash) methods.push({ method: 'bKash', ...bkash });
    if (nagad) methods.push({ method: 'Nagad', ...nagad });

    return methods;
}

export async function updatePaymentMethods(bkashNumber: string, nagadNumber: string) {
    // Assuming type is always 'Personal' for this case
    await updateSetting('payment_method_bkash', { number: bkashNumber, type: 'Personal' });
    await updateSetting('payment_method_nagad', { number: nagadNumber, type: 'Personal' });
}
