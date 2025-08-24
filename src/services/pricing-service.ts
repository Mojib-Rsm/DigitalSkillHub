
'use server';

import { getFirestore, collection, getDocs, orderBy, query, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

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

let pricingPlansCache: PricingPlan[] | null = null;

export async function getPricingPlans(): Promise<PricingPlan[]> {
    if (pricingPlansCache) {
        return pricingPlansCache;
    }

    try {
        const db = getFirestore(app);
        const pricingCol = collection(db, 'pricing');
        const q = query(pricingCol, orderBy('price', 'asc'));
        const pricingSnapshot = await getDocs(q);
        
        if (pricingSnapshot.empty) {
            console.warn("No pricing plans found in Firestore. You may need to seed the database.");
            return [];
        }

        const pricingList = pricingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingPlan));
        pricingPlansCache = pricingList;
        return pricingList;
    } catch (error) {
        console.error("Error fetching pricing plans from Firestore:", error);
        return [];
    }
}

export async function addPricingPlan(planData: Omit<PricingPlan, 'id'>) {
    try {
        const db = getFirestore(app);
        const pricingCol = collection(db, 'pricing');
        const docRef = await addDoc(pricingCol, planData);
        pricingPlansCache = null; // Invalidate cache
        revalidatePath('/#pricing');
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
        pricingPlansCache = null; // Invalidate cache
        revalidatePath('/#pricing');
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
        pricingPlansCache = null; // Invalidate cache
        revalidatePath('/#pricing');
        revalidatePath('/dashboard/admin/pricing');
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
