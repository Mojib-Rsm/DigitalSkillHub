
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
            
            // Check if collection is already seeded to prevent duplicates
            const snapshot = await getDocs(collectionRef);
            if (!snapshot.empty) {
                console.log(`Collection "${collectionName}" already has data. Skipping.`);
                return 0; // Return 0 operations
            }
            
            // Firestore batches have a limit of 500 operations.
            // We create a new batch for each collection to stay under the limit.
            const batch = writeBatch(db);
            let operationsCount = 0;

            data.forEach((item) => {
                const docRef = item.id ? doc(collectionRef, item.id) : doc(collectionRef);
                const dataToSet = { ...item };
                if (item.id) {
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

        if (totalOperationsCount === 0) {
            return {
                success: true,
                message: "All collections were already seeded with data. No new data was added."
            };
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
