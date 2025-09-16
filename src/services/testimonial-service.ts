
'use server';

import pool from '@/lib/db';
import { testimonials as demoTestimonials } from '@/lib/demo-data';


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
    try {
        const result = await pool.query('SELECT * FROM testimonials');
        if (result.rows.length === 0) {
            // If table is empty, return demo data
            return demoTestimonials;
        }
        return result.rows.map(row => ({
            ...row, 
            id: row.id.toString(),
            authorName: row.authorname,
            authorRole: row.authorrole,
            dataAiHint: row.dataaihint,
        })) as Testimonial[];
    } catch (error) {
        console.error("Error fetching testimonials from PostgreSQL. This might be because the table does not exist. Falling back to demo data.", error);
        // Fallback to demo data if there's any error (e.g., connection failed)
        return demoTestimonials;
    }
}
