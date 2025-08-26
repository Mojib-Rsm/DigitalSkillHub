
'use server';

import { 
    getFirestore, 
    collection, 
    writeBatch, 
    getDocs,
    query,
    doc,
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
        // We now use static data, so we can define the collections directly
        const collectionsToSeed = [
            { name: 'tools', data: tools, uniqueKey: 'href' },
            { name: 'courses', data: allCourses, uniqueKey: 'title' },
            { name: 'blog', data: blogPosts, uniqueKey: 'title' },
            { name: 'jobs', data: jobPostings, uniqueKey: 'title' },
            { name: 'pricing', data: pricingPlans, uniqueKey: 'name' },
            { name: 'testimonials', data: testimonials, uniqueKey: 'quote' },
            { name: 'users', data: users, uniqueKey: 'email' },
        ];

        let documentsWritten = 0;
        let collectionsSkipped = 0;

        for (const { name, data, uniqueKey } of collectionsToSeed) {
            const collectionRef = collection(db, name);
            // This is the critical part: we perform a read operation here.
            // With the new architecture, this should only be done by an admin from the dashboard,
            // and the daily quota should be sufficient for these occasional operations.
            const snapshot = await getDocs(query(collectionRef));
            
            if (snapshot.empty) {
                // Collection is empty, seed all data
                const batch = writeBatch(db);
                data.forEach(item => {
                    const docRef = doc(collectionRef); 
                    batch.set(docRef, item); // Store the whole object including ID if it exists
                    documentsWritten++;
                });
                await batch.commit();
            } else {
                 // Collection exists, check for missing items to avoid duplicates
                 const existingItems = new Set(snapshot.docs.map(doc => (doc.data() as any)[uniqueKey]));
                 const batch = writeBatch(db);
                 let itemsAddedToBatch = 0;
                 
                 data.forEach(item => {
                     if (!existingItems.has((item as any)[uniqueKey])) {
                         const docRef = doc(collectionRef);
                         batch.set(docRef, item);
                         documentsWritten++;
                         itemsAddedToBatch++;
                     }
                 });

                 if (itemsAddedToBatch > 0) {
                     await batch.commit();
                 } else {
                    collectionsSkipped++;
                 }
            }
        }
        
        if (documentsWritten === 0 && collectionsSkipped > 0) {
             return { success: true, message: 'Database is already up to date. No new data was seeded.' };
        }

        return { success: true, message: `Successfully seeded ${documentsWritten} new documents.` };

    } catch (error) {
        console.error("Error seeding database:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Database seeding failed: ${errorMessage}` };
    }
}
