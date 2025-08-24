
'use server';

import { getFirestore, collection, getDocs, query, where, orderBy, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
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

let couponsCache: Coupon[] | null = null;

export async function getCoupons(): Promise<Coupon[]> {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        console.warn("Permission denied: Only admins can fetch all coupons.");
        return [];
    }

    if (couponsCache) {
        return couponsCache;
    }

    try {
        const db = getFirestore(app);
        const couponsCol = collection(db, 'coupons');
        const q = query(couponsCol, orderBy('code'));
        const couponSnapshot = await getDocs(q);

        const couponList = couponSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                validUntil: data.validUntil?.toDate(),
            } as Coupon;
        });

        couponsCache = couponList;
        return couponList;
    } catch (error) {
        console.error("Error fetching coupons from Firestore:", error);
        return [];
    }
}

export async function getActiveCoupons(): Promise<Coupon[]> {
     try {
        const db = getFirestore(app);
        const couponsCol = collection(db, 'coupons');
        const q = query(couponsCol, where('isActive', '==', true), orderBy('discountPercentage', 'desc'));
        const couponSnapshot = await getDocs(q);

        const couponList = couponSnapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    validUntil: data.validUntil?.toDate(),
                } as Coupon;
            })
            .filter(coupon => {
                // Also filter by date if validUntil is set
                return !coupon.validUntil || coupon.validUntil > new Date();
            });

        return couponList;
    } catch (error) {
        console.error("Error fetching active coupons from Firestore:", error);
        return [];
    }
}


export async function addCoupon(couponData: Omit<Coupon, 'id'>) {
    try {
        const db = getFirestore(app);
        const couponsCol = collection(db, 'coupons');
        const docRef = await addDoc(couponsCol, couponData);
        couponsCache = null; // Invalidate cache
        revalidatePath('/dashboard/admin/coupons');
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function updateCoupon(couponId: string, couponData: Partial<Omit<Coupon, 'id'>>) {
    try {
        const db = getFirestore(app);
        const couponRef = doc(db, 'coupons', couponId);
        await updateDoc(couponRef, couponData);
        couponsCache = null; // Invalidate cache
        revalidatePath('/dashboard/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function deleteCoupon(couponId: string) {
    try {
        const db = getFirestore(app);
        const couponRef = doc(db, 'coupons', couponId);
        await deleteDoc(couponRef);
        couponsCache = null; // Invalidate cache
        revalidatePath('/dashboard/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
