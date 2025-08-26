
'use server';

import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { testimonials as staticTestimonials } from '@/lib/demo-data'; // Import static data

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

export async function getTestimonials(): Promise<Testimonial[]> {
    // Return static data to avoid Firestore reads on public pages
    return staticTestimonials;
}
