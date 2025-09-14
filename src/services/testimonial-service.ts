
'use server';

import pool from '@/lib/mysql';
import { RowDataPacket } from 'mysql2';

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
        return rows.map(row => ({...row, id: row.id.toString()})) as Testimonial[];
    } catch (error) {
        console.error("Error fetching testimonials from MySQL. This might be because the table does not exist. Please run the seeding script (`npm run db:seed`).", error);
        return [];
    }
}
