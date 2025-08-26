
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

export type Testimonial = {
    id: string;
    feature: string;
    quote: string;
    metric: string;
    authorName: string;
    authorRole: string;
    avatar: string;
    dataAiHint: string;
};

let testimonialsCache: Testimonial[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function getTestimonials(): Promise<Testimonial[]> {
    const now = Date.now();
    if (testimonialsCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION_MS)) {
        return testimonialsCache;
    }

    try {
        const db = getFirestore(app);
        const testimonialsCol = collection(db, 'testimonials');
        const testimonialSnapshot = await getDocs(testimonialsCol);
        
        if (testimonialSnapshot.empty) {
            console.warn("No testimonials found in Firestore. You may need to seed the database.");
            return [];
        }

        const testimonialList = testimonialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        testimonialsCache = testimonialList;
        cacheTimestamp = now;
        return testimonialList;
    } catch (error) {
        console.error("Error fetching testimonials from Firestore:", error);
        return [];
    }
}
