
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { allCourses, blogPosts, jobPostings, pricingPlans, testimonials, tools, users } from '@/lib/demo-data';

export async function seedDatabase() {
    if (!adminDb) {
        return {
            success: false,
            message: "Firebase Admin SDK is not initialized. Please check your server environment variables."
        };
    }
    
    let totalOperationsCount = 0;
    const collectionsToSeed = [
        { name: 'courses', data: allCourses },
        { name: 'blog', data: blogPosts },
        { name: 'jobs', data: jobPostings },
        { name: 'pricing', data: pricingPlans },
        { name: 'testimonials', data: testimonials },
        { name: 'tools', data: tools },
        { name: 'users', data: users },
    ];

    try {
        // Helper function to seed a single collection in its own batch
        const seedCollection = async (collectionName: string, data: any[]) => {
            const collectionRef = adminDb.collection(collectionName);
            const batch = adminDb.batch();
            let operationsCount = 0;

            data.forEach((item) => {
                const docRef = item.id ? collectionRef.doc(item.id) : collectionRef.doc();
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
