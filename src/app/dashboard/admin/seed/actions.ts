
'use server';

import { 
    getFirestore, 
    collection, 
    addDoc, 
    writeBatch, 
    getDocs,
    query,
} from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { getCurrentUser } from '@/services/user-service';
import {
  tools,
  allCourses,
  blogPosts,
  jobPostings,
  pricingPlans,
  testimonials,
  users
} from '@/lib/demo-data';

export async function seedDatabaseAction() {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        return { success: false, message: 'Permission denied. You must be an admin to seed the database.' };
    }

    const db = getFirestore(app);

    try {
        const collectionsToSeed = [
            { name: 'tools', data: tools },
            { name: 'courses', data: allCourses },
            { name: 'blog', data: blogPosts },
            { name: 'jobs', data: jobPostings },
            { name: 'pricing', data: pricingPlans },
            { name: 'testimonials', data: testimonials },
            { name: 'users', data: users },
        ];

        let documentsWritten = 0;

        for (const { name, data } of collectionsToSeed) {
            const collectionRef = collection(db, name);
            const snapshot = await getDocs(query(collectionRef));
            
            if (!snapshot.empty) {
                console.log(`Collection '${name}' is not empty. Skipping seeding.`);
                continue;
            }

            const batch = writeBatch(db);
            data.forEach(item => {
                const docRef = collectionRef.doc();
                batch.set(docRef, item);
                documentsWritten++;
            });
            await batch.commit();
        }

        if (documentsWritten === 0) {
             return { success: true, message: 'Database already contains data. No new data was seeded.' };
        }

        return { success: true, message: `Successfully seeded ${documentsWritten} documents across ${collectionsToSeed.length} collections.` };

    } catch (error) {
        console.error("Error seeding database:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Database seeding failed: ${errorMessage}` };
    }
}
