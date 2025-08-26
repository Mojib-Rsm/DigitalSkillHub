

import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

export type Course = {
    id: string;
    title: string;
    category: string;
    instructor: string;
    price: number;
    level: string;
    duration: string;
    image: string;
    dataAiHint: string;
};

let coursesCache: Course[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

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
    const now = Date.now();
    if (coursesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION_MS)) {
        return coursesCache;
    }

    try {
        const db = getFirestore(app);
        const coursesCol = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCol);
        const coursesList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        coursesCache = coursesList;
        cacheTimestamp = now;
        return coursesList;
    } catch (error) {
        console.error("Error fetching courses from Firestore:", error);
        // In case of an error, you might want to return an empty array 
        // or a default list, or re-throw the error.
        return [];
    }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    const courses = await getCourses();
    const course = courses.find(c => slugify(c.title) === slug);
    return course || null;
}
