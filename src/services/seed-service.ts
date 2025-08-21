
'use client';

import { 
    getFirestore, 
    collection, 
    writeBatch,
    getDocs
} from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { allCourses, blogPosts, jobPostings, pricingPlans, testimonials, users } from '@/lib/demo-data';


export async function seedDatabase() {
    const db = getFirestore(app);
    const batch = writeBatch(db);
    let operationsCount = 0;

    try {
        // Helper function to seed a collection
        const seedCollection = async (collectionName: string, data: any[]) => {
            const collectionRef = collection(db, collectionName);
            
            // Optional: Check if collection is already seeded to prevent duplicates
            const snapshot = await getDocs(collectionRef);
            if (!snapshot.empty) {
                console.log(`Collection "${collectionName}" already has data. Skipping.`);
                return;
            }

            data.forEach((item) => {
                // For 'users', use the specified uid. For others, let Firestore generate the ID.
                const docRef = collectionName === 'users' ? doc(collectionRef, item.uid) : doc(collectionRef);
                const dataToSet = { ...item };
                if (collectionName === 'users') {
                    delete dataToSet.uid; // Don't store the uid inside the document itself
                }
                batch.set(docRef, dataToSet);
                operationsCount++;
            });
        };

        // Seed all collections
        await seedCollection('courses', allCourses);
        await seedCollection('blog', blogPosts);
        await seedCollection('jobs', jobPostings);
        await seedCollection('pricing', pricingPlans);
        await seedCollection('testimonials', testimonials);
        await seedCollection('users', users);

        if (operationsCount === 0) {
            return {
                success: true,
                message: "All collections were already seeded with data. No new data was added."
            };
        }

        // Commit the batch
        await batch.commit();
        
        return { 
            success: true, 
            message: `Successfully seeded database with ${operationsCount} documents.` 
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

// Need to import `doc` for the 'users' collection with specific UIDs
import { doc } from 'firebase/firestore';

    