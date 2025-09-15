
'use server';

import pool from '@/lib/mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pricingPlans as demoPricingPlans } from '@/lib/demo-data';

export type PricingPlan = {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: string;
    description: string;
    credits: number;
    validity: string;
    isPopular?: boolean;
    features: Record<string, string[]>;
};

function mapRowsToPlans(rows: RowDataPacket[]): PricingPlan[] {
    return rows.map(row => ({
        ...row,
        id: row.id.toString(),
        isPopular: !!row.isPopular,
        features: row.features ? JSON.parse(row.features) : {},
    })) as PricingPlan[];
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pricing_plans ORDER BY price');
        if (rows.length === 0) {
            return demoPricingPlans;
        }
        return mapRowsToPlans(rows);
    } catch (error) {
        console.error("Error fetching pricing plans from MySQL. Falling back to demo data.", error);
        return demoPricingPlans;
    }
}


export async function getPricingPlanById(id: string): Promise<PricingPlan | null> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pricing_plans WHERE id = ?', [id]);
        if (rows.length > 0) {
            const plans = mapRowsToPlans(rows);
            return plans[0];
        }
        // Fallback to demo data if not found in DB
        return demoPricingPlans.find(p => p.id === id) || null;
    } catch (error) {
        console.error(`Error fetching pricing plan with id ${id} from MySQL. Falling back to demo data.`, error);
        return demoPricingPlans.find(p => p.id === id) || null;
    }
}


// Admin functions still interact with MySQL
export async function addPricingPlan(planData: Omit<PricingPlan, 'id'>) {
    try {
        const dataToInsert = { ...planData, features: JSON.stringify(planData.features) };
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO pricing_plans SET ?', [dataToInsert]);
        return { success: true, id: result.insertId.toString() };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updatePricingPlan(planId: string, planData: Partial<Omit<PricingPlan, 'id'>>) {
    try {
        const dataToUpdate = planData.features 
            ? { ...planData, features: JSON.stringify(planData.features) }
            : planData;
        await pool.query('UPDATE pricing_plans SET ? WHERE id = ?', [dataToUpdate, planId]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function deletePricingPlan(planId: string) {
    try {
        await pool.query('DELETE FROM pricing_plans WHERE id = ?', [planId]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
