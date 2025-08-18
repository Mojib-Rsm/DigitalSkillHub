
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
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

export async function getCourses(): Promise<Course[]> {
    if (coursesCache) {
        return coursesCache;
    }

    try {
        const db = getFirestore(app);
        const coursesCol = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCol);
        const coursesList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        coursesCache = coursesList;
        return coursesList;
    } catch (error) {
        console.error("Error fetching courses from Firestore:", error);
        // In case of an error, you might want to return an empty array 
        // or a default list, or re-throw the error.
        return [];
    }
}
