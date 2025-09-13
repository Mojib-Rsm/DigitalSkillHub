
'use server';

import pool from '@/lib/mysql';
import { RowDataPacket } from 'mysql2';

export type Course = {
    id?: string;
    title: string;
    category: string;
    instructor: string;
    price: number;
    level: string;
    duration: string;
    image: string;
    dataAiHint: string;
};

// A simple slugify function
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

async function mapRowsToCourses(rows: RowDataPacket[]): Promise<Course[]> {
    return rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        category: row.category,
        instructor: row.instructor,
        price: row.price,
        level: row.level,
        duration: row.duration,
        image: row.image,
        dataAiHint: row.dataAiHint,
    }));
}

export async function getCourses(): Promise<Course[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM courses');
        return mapRowsToCourses(rows);
    } catch (error) {
        console.error("Error fetching courses from MySQL:", error);
        return [];
    }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    // Since slug is derived, we find by title and then check slug.
    // In a real DB, you'd store the slug.
    const courses = await getCourses();
    const course = courses.find(c => slugify(c.title) === slug);
    return course || null;
}
