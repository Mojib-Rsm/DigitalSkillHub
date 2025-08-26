
'use server';

import { getFirestore, collection, getDocs, orderBy, query, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { pricingPlans as staticPricingPlans } from '@/lib/demo-data'; // Import static data

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

export async function getPricingPlans(): Promise<PricingPlan[]> {
    // Return static data to avoid Firestore reads on public pages
    return staticPricingPlans;
}

// Admin functions still interact with Firestore
export async function addPricingPlan(planData: Omit<PricingPlan, 'id'>) {
    try {
        const db = getFirestore(app);
        const pricingCol = collection(db, 'pricing');
        const docRef = await addDoc(pricingCol, planData);
        revalidatePath('/dashboard/admin/pricing');
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updatePricingPlan(planId: string, planData: Partial<Omit<PricingPlan, 'id'>>) {
    try {
        const db = getFirestore(app);
        const planRef = doc(db, 'pricing', planId);
        await updateDoc(planRef, planData);
        revalidatePath('/dashboard/admin/pricing');
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function deletePricingPlan(planId: string) {
    try {
        const db = getFirestore(app);
        const planRef = doc(db, 'pricing', planId);
        await deleteDoc(planRef);
        revalidatePath('/dashboard/admin/pricing');
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
