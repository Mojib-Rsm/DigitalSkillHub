
'use server';

import pool from '@/lib/mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
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

function mapRowsToCoupons(rows: RowDataPacket[]): Coupon[] {
    return rows.map(row => ({
        ...row,
        id: row.id.toString(),
        isActive: !!row.isActive,
        applicableTo: row.applicableTo === 'all' ? 'all' : JSON.parse(row.applicableTo)
    })) as Coupon[];
}

export async function getCoupons(): Promise<Coupon[]> {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        console.warn("Permission denied: Only admins can fetch all coupons.");
        return [];
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM coupons ORDER BY code');
        return mapRowsToCoupons(rows);
    } catch (error) {
        console.error("Error fetching coupons from MySQL:", error);
        return [];
    }
}

export async function getActiveCoupons(): Promise<Coupon[]> {
     try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM coupons WHERE isActive = 1 AND (validUntil IS NULL OR validUntil > NOW())'
        );
        return mapRowsToCoupons(rows);
    } catch (error) {
        console.error("Error fetching active coupons from MySQL. This might be because the table does not exist. Please run the seeding script (`npm run db:seed`).", error);
        return [];
    }
}


export async function addCoupon(couponData: Omit<Coupon, 'id'>) {
    try {
        const dataToInsert = {
            ...couponData,
            applicableTo: Array.isArray(couponData.applicableTo) ? JSON.stringify(couponData.applicableTo) : couponData.applicableTo
        };
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO coupons SET ?', [dataToInsert]);
        return { success: true, id: result.insertId.toString() };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updateCoupon(couponId: string, couponData: Partial<Omit<Coupon, 'id'>>) {
    try {
        const dataToUpdate = {
            ...couponData,
            applicableTo: Array.isArray(couponData.applicableTo) ? JSON.stringify(couponData.applicableTo) : couponData.applicableTo
        };
        await pool.query('UPDATE coupons SET ? WHERE id = ?', [dataToUpdate, couponId]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function deleteCoupon(couponId: string) {
    try {
        await pool.query('DELETE FROM coupons WHERE id = ?', [couponId]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
