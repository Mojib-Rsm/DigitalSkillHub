
'use server';

import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { allCourses as staticCourses } from '@/lib/demo-data'; // Import static data

export type Course = {
    id?: string; // ID might be from Firestore or absent for static data
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

export async function getCourses(): Promise<Course[]> {
    // Directly return the static data from demo-data.ts
    // This avoids any Firestore read operations for public-facing pages.
    return staticCourses;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    const courses = await getCourses();
    const course = courses.find(c => slugify(c.title) === slug);
    return course || null;
}
