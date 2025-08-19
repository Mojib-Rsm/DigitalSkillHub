
'use server';

/**
 * @fileOverview A flow to seed demo data into Firestore.
 * This should be run once to populate the database.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as firestore from 'firebase-admin/firestore';
import { app } from '@/lib/firebase-admin';
import { allCourses, blogPosts, jobPostings } from '@/lib/demo-data';

const SeedDataOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  coursesAdded: z.number(),
  blogPostsAdded: z.number(),
  jobsAdded: z.number(),
});

export type SeedDataOutput = z.infer<typeof SeedDataOutputSchema>;

export const seedDataFlow = ai.defineFlow(
  {
    name: 'seedDataFlow',
    inputSchema: z.void(),
    outputSchema: SeedDataOutputSchema,
  },
  async () => {
    if (!app) {
        throw new Error("Firebase Admin SDK is not initialized. Cannot seed data.");
    }
    
    const db = firestore.getFirestore(app);
    const batch = db.batch();
    let coursesAdded = 0;
    let blogPostsAdded = 0;
    let jobsAdded = 0;

    try {
      // Seed Courses
      const coursesCollection = firestore.collection(db, 'courses');
      allCourses.forEach(course => {
        const docRef = coursesCollection.doc(); // Auto-generate ID
        batch.set(docRef, course);
        coursesAdded++;
      });

      // Seed Blog Posts
      const blogCollection = firestore.collection(db, 'blog');
      blogPosts.forEach(post => {
        const docRef = blogCollection.doc(); // Auto-generate ID
        batch.set(docRef, post);
        blogPostsAdded++;
      });
      
      // Seed Job Postings
      const jobsCollection = firestore.collection(db, 'jobs');
      jobPostings.forEach(job => {
        const docRef = jobsCollection.doc(); // Auto-generate ID
        batch.set(docRef, job);
        jobsAdded++;
      });

      await batch.commit();
      
      const message = `Successfully seeded ${coursesAdded} courses, ${blogPostsAdded} blog posts, and ${jobsAdded} jobs.`;
      console.log(message);
      return {
        success: true,
        message,
        coursesAdded,
        blogPostsAdded,
        jobsAdded,
      };

    } catch (error) {
      console.error('Error seeding data to Firestore:', error);
      if (error instanceof Error) {
        return {
          success: false,
          message: `Failed to seed data: ${error.message}`,
          coursesAdded: 0,
          blogPostsAdded: 0,
          jobsAdded: 0,
        };
      }
       return {
          success: false,
          message: 'An unknown error occurred during data seeding.',
          coursesAdded: 0,
          blogPostsAdded: 0,
          jobsAdded: 0,
        };
    }
  }
);
