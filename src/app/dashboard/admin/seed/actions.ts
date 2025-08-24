
'use server';

import { 
    getFirestore, 
    collection, 
    addDoc, 
    writeBatch, 
    getDocs,
    query,
    doc, // Import the 'doc' function
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
            { name: 'tools', data: tools, uniqueKey: 'id' },
            { name: 'courses', data: allCourses, uniqueKey: 'title' },
            { name: 'blog', data: blogPosts, uniqueKey: 'title' },
            { name: 'jobs', data: jobPostings, uniqueKey: 'title' },
            { name: 'pricing', data: pricingPlans, uniqueKey: 'id' },
            { name: 'testimonials', data: testimonials, uniqueKey: 'id' },
            { name: 'users', data: users, uniqueKey: 'email' },
        ];

        let documentsWritten = 0;
        let collectionsSkipped = 0;

        for (const { name, data, uniqueKey } of collectionsToSeed) {
            const collectionRef = collection(db, name);
            const snapshot = await getDocs(query(collectionRef));
            
            if (snapshot.empty) {
                 // Collection is empty, seed all data
                const batch = writeBatch(db);
                data.forEach(item => {
                    // Use doc(collectionRef) to create a new document reference with an auto-generated ID
                    const docRef = doc(collectionRef); 
                    batch.set(docRef, item);
                    documentsWritten++;
                });
                await batch.commit();
            } else {
                 // Collection exists, check for missing items
                 const existingItems = new Set(snapshot.docs.map(doc => doc.data()[uniqueKey]));
                 const batch = writeBatch(db);
                 let itemsAddedToBatch = 0;
                 
                 data.forEach(item => {
                     if (!existingItems.has((item as any)[uniqueKey])) {
                         // Use doc(collectionRef) to create a new document reference with an auto-generated ID
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
