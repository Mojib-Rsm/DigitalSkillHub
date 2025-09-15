
'use server';

import pool from '@/lib/mysql';
import { RowDataPacket } from 'mysql2';
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
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM testimonials');
        if (rows.length === 0) {
            // If table is empty, return demo data
            return demoTestimonials;
        }
        return rows.map(row => ({...row, id: row.id.toString()})) as Testimonial[];
    } catch (error) {
        console.error("Error fetching testimonials from MySQL. This might be because the table does not exist or a network issue. Falling back to demo data.", error);
        // Fallback to demo data if there's any error (e.g., connection failed)
        return demoTestimonials;
    }
}
