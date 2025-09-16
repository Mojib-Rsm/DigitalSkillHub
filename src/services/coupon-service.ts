
'use server';

import pool from '@/lib/db';
import { getCurrentUser } from './user-service';

export type Coupon = {
    id: string;
    code: string;
    description?: string;
    discountPercentage: number;
    isActive: boolean;
    validUntil?: Date;
    applicableTo: 'all' | string[]; // 'all' or array of tool IDs
};

function mapRowsToCoupons(rows: any[]): Coupon[] {
    return rows.map(row => ({
        ...row,
        id: row.id.toString(),
        isActive: !!row.isactive,
        discountPercentage: row.discountpercentage,
        validUntil: row.validuntil,
        applicableTo: row.applicableto
    }));
}

export async function getCoupons(): Promise<Coupon[]> {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        console.warn("Permission denied: Only admins can fetch all coupons.");
        return [];
    }

    try {
        const result = await pool.query('SELECT * FROM coupons ORDER BY code');
        return mapRowsToCoupons(result.rows);
    } catch (error) {
        console.error("Error fetching coupons from PostgreSQL:", error);
        return [];
    }
}

export async function getActiveCoupons(): Promise<Coupon[]> {
     try {
        const result = await pool.query(
            'SELECT * FROM coupons WHERE isActive = TRUE AND (validUntil IS NULL OR validUntil > NOW())'
        );
        return mapRowsToCoupons(result.rows);
    } catch (error) {
        console.error("Error fetching active coupons from PostgreSQL. This might be because the table does not exist. Please run the seeding script (`npm run db:seed`).", error);
        return [];
    }
}


export async function addCoupon(couponData: Omit<Coupon, 'id'>) {
    try {
        const { code, description, discountPercentage, isActive, validUntil, applicableTo } = couponData;
        const result = await pool.query(
            'INSERT INTO coupons (code, description, discountPercentage, isActive, validUntil, applicableTo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [code, description, discountPercentage, isActive, validUntil, applicableTo]
        );
        return { success: true, id: result.rows[0].id.toString() };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updateCoupon(couponId: string, couponData: Partial<Omit<Coupon, 'id'>>) {
    try {
        const entries = Object.entries(couponData).filter(([_, v]) => v !== undefined);
        const setClause = entries.map(([key], i) => `"${key.toLowerCase()}" = $${i + 2}`).join(', ');
        const values = entries.map(([_, v]) => v);

        if (entries.length === 0) return { success: true };

        await pool.query(`UPDATE coupons SET ${setClause} WHERE id = $1`, [couponId, ...values]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function deleteCoupon(couponId: string) {
    try {
        await pool.query('DELETE FROM coupons WHERE id = $1', [couponId]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
