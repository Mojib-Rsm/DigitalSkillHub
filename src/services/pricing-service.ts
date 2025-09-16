
'use server';

import pool from '@/lib/db';
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

function mapRowsToPlans(rows: any[]): PricingPlan[] {
    return rows.map(row => ({
        ...row,
        id: row.id.toString(),
        isPopular: !!row.ispopular,
        originalPrice: row.originalprice,
        features: row.features || {},
    }));
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
    try {
        const result = await pool.query('SELECT * FROM pricing_plans ORDER BY price');
        if (result.rows.length === 0) {
            return demoPricingPlans;
        }
        return mapRowsToPlans(result.rows);
    } catch (error) {
        console.error("Error fetching pricing plans from PostgreSQL. Falling back to demo data.", error);
        return demoPricingPlans;
    }
}


export async function getPricingPlanById(id: string): Promise<PricingPlan | null> {
    try {
        const result = await pool.query('SELECT * FROM pricing_plans WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            const plans = mapRowsToPlans(result.rows);
            return plans[0];
        }
        // Fallback to demo data if not found in DB
        return demoPricingPlans.find(p => p.id === id) || null;
    } catch (error) {
        console.error(`Error fetching pricing plan with id ${id} from PostgreSQL. Falling back to demo data.`, error);
        return demoPricingPlans.find(p => p.id === id) || null;
    }
}


// Admin functions still interact with PostgreSQL
export async function addPricingPlan(planData: Omit<PricingPlan, 'id'>) {
    try {
        const { name, price, originalPrice, discount, description, credits, validity, isPopular, features } = planData;
        const result = await pool.query(
            'INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [name, price, originalPrice, discount, description, credits, validity, isPopular, features]
        );
        return { success: true, id: result.rows[0].id.toString() };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updatePricingPlan(planId: string, planData: Partial<Omit<PricingPlan, 'id'>>) {
    try {
        const entries = Object.entries(planData).filter(([_, v]) => v !== undefined);
        const setClause = entries.map(([key], i) => `"${key.toLowerCase()}" = $${i + 2}`).join(', ');
        const values = entries.map(([_, v]) => v);

        if (entries.length === 0) return { success: true };

        await pool.query(`UPDATE pricing_plans SET ${setClause} WHERE id = $1`, [planId, ...values]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function deletePricingPlan(planId: string) {
    try {
        await pool.query('DELETE FROM pricing_plans WHERE id = $1', [planId]);
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
