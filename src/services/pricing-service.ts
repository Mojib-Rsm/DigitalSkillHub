
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

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
        // Order by price to maintain a consistent order
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
