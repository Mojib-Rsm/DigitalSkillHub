
'use client';

import { 
    getFirestore, 
    collection, 
    writeBatch,
    getDocs,
    doc
} from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { allCourses, blogPosts, jobPostings, pricingPlans, testimonials, users } from '@/lib/demo-data';


export async function seedDatabase() {
    const db = getFirestore(app);
    let totalOperationsCount = 0;
    const collectionsToSeed = [
        { name: 'courses', data: allCourses },
        { name: 'blog', data: blogPosts },
        { name: 'jobs', data: jobPostings },
        { name: 'pricing', data: pricingPlans },
        { name: 'testimonials', data: testimonials },
        { name: 'users', data: users },
    ];

    try {
        // Helper function to seed a single collection in its own batch
        const seedCollection = async (collectionName: string, data: any[]) => {
            const collectionRef = collection(db, collectionName);
            
            // Firestore batches have a limit of 500 operations.
            // We create a new batch for each collection to stay under the limit.
            const batch = writeBatch(db);
            let operationsCount = 0;

            data.forEach((item) => {
                // Use a specific ID if provided (like for users), otherwise let Firestore auto-generate.
                const docRef = item.email ? doc(collectionRef, item.email) : (item.id ? doc(collectionRef, item.id) : doc(collectionRef));
                const dataToSet = { ...item };
                if (item.id) {
                    // Don't store the id field inside the document if we're using it as the document ID
                    delete dataToSet.id;
                }
                batch.set(docRef, dataToSet);
                operationsCount++;
            });

            if (operationsCount > 0) {
                 await batch.commit();
                 console.log(`Successfully seeded collection "${collectionName}" with ${operationsCount} documents.`);
            }
            return operationsCount;
        };

        for (const { name, data } of collectionsToSeed) {
            const count = await seedCollection(name, data);
            totalOperationsCount += count;
        }
        
        return { 
            success: true, 
            message: `Successfully seeded database with ${totalOperationsCount} documents across ${collectionsToSeed.length} collections.` 
        };

    } catch (error) {
        console.error("Error seeding database:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { 
            success: false, 
            message: `Failed to seed database: ${errorMessage}` 
        };
    }
}
