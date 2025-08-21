
'use server';

/**
 * @fileOverview A flow to seed demo data into Firestore.
 * This should be run once to populate the database.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import admin from 'firebase-admin';
import { app } from '@/lib/firebase-admin';
import { allCourses, blogPosts, jobPostings, pricingPlans, testimonials, tools, users } from '@/lib/demo-data';
import crypto from 'crypto';

const SeedDataOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  coursesAdded: z.number(),
  blogPostsAdded: z.number(),
  jobsAdded: z.number(),
  usersAdded: z.number(),
  toolsAdded: z.number(),
  pricingPlansAdded: z.number(),
  testimonialsAdded: z.number(),
});

export type SeedDataOutput = z.infer<typeof SeedDataOutputSchema>;

// Helper function to hash password - must be identical to the one in free-trial/actions.ts
function simpleHash(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}


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
    
    const db = admin.firestore();
    const batch = db.batch();
    let coursesAdded = 0;
    let blogPostsAdded = 0;
    let jobsAdded = 0;
    let usersAdded = 0;
    let toolsAdded = 0;
    let pricingPlansAdded = 0;
    let testimonialsAdded = 0;

    try {
      // Seed Courses
      const coursesCollection = db.collection('courses');
      allCourses.forEach(course => {
        const docRef = coursesCollection.doc(); // Auto-generate ID
        batch.set(docRef, course);
        coursesAdded++;
      });

      // Seed Blog Posts
      const blogCollection = db.collection('blog');
      blogPosts.forEach(post => {
        const docRef = blogCollection.doc(); // Auto-generate ID
        batch.set(docRef, post);
        blogPostsAdded++;
      });
      
      // Seed Job Postings
      const jobsCollection = db.collection('jobs');
      jobPostings.forEach(job => {
        const docRef = jobsCollection.doc(); // Auto-generate ID
        batch.set(docRef, job);
        jobsAdded++;
      });

       // Seed Users
      const usersCollection = db.collection('users');
      users.forEach(user => {
        const docRef = usersCollection.doc(user.uid); // Use predefined UID
        const { uid, password, ...userData } = user;
        batch.set(docRef, { 
            ...userData, 
            password: simpleHash(password), // Hash the password before storing
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        usersAdded++;
      });

      // Seed Tools
      const toolsCollection = db.collection('tools');
      tools.forEach(tool => {
        const docRef = toolsCollection.doc(); // Auto-generate ID
        batch.set(docRef, tool);
        toolsAdded++;
      });

      // Seed Pricing Plans
      const pricingCollection = db.collection('pricing');
      pricingPlans.forEach(plan => {
        const docRef = pricingCollection.doc(plan.id); // Use predefined ID
        batch.set(docRef, plan);
        pricingPlansAdded++;
      });

       // Seed Testimonials
      const testimonialsCollection = db.collection('testimonials');
      testimonials.forEach(testimonial => {
        const docRef = testimonialsCollection.doc(); // Auto-generate ID
        batch.set(docRef, testimonial);
        testimonialsAdded++;
      });

      await batch.commit();
      
      const message = `Successfully seeded data: ${coursesAdded} courses, ${blogPostsAdded} blog posts, ${jobsAdded} jobs, ${usersAdded} users, ${toolsAdded} tools, ${pricingPlansAdded} pricing plans, ${testimonialsAdded} testimonials.`;
      console.log(message);
      return {
        success: true,
        message,
        coursesAdded,
        blogPostsAdded,
        jobsAdded,
        usersAdded,
        toolsAdded,
        pricingPlansAdded,
        testimonialsAdded
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
          usersAdded: 0,
          toolsAdded: 0,
          pricingPlansAdded: 0,
          testimonialsAdded: 0,
        };
      }
       return {
          success: false,
          message: 'An unknown error occurred during data seeding.',
          coursesAdded: 0,
          blogPostsAdded: 0,
          jobsAdded: 0,
          usersAdded: 0,
          toolsAdded: 0,
          pricingPlansAdded: 0,
          testimonialsAdded: 0,
        };
    }
  }
);
