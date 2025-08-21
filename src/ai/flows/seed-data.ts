'use server';

/**
 * @fileOverview A flow to seed demo data into Firestore.
 * This should be run once to populate the database.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { allCourses, blogPosts, jobPostings, pricingPlans, testimonials, users } from '@/lib/demo-data';
import { getConfig } from 'next/config';

const SeedDataOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  usersAdded: z.number(),
  coursesAdded: z.number(),
  blogPostsAdded: z.number(),
  jobsAdded: z.number(),
  toolsAdded: z.number(),
  pricingPlansAdded: z.number(),
  testimonialsAdded: z.number(),
});

export type SeedDataOutput = z.infer<typeof SeedDataOutputSchema>;


export const seedDataFlow = ai.defineFlow(
  {
    name: 'seedDataFlow',
    inputSchema: z.void(),
    outputSchema: SeedDataOutputSchema,
  },
  async () => {
    
    // Initialize Firebase Admin SDK if not already initialized
    if (getApps().length === 0) {
        try {
            const { serverRuntimeConfig } = getConfig();
            const serviceAccountJsonString = serverRuntimeConfig.googleAppCredsJson;

            if (!serviceAccountJsonString) {
                throw new Error('Firebase service account credentials are not correctly configured in next.config.js.');
            }
            
            let serviceAccount;
            try {
                serviceAccount = JSON.parse(serviceAccountJsonString);
            } catch (e) {
                 throw new Error(`Failed to parse Firebase service account JSON. Error: ${e instanceof Error ? e.message : String(e)}`);
            }

            initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (error) {
            console.error("Firebase admin initialization error in seedDataFlow:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during Firebase Admin initialization.';
            return {
                success: false,
                message: `Failed to initialize Firebase Admin: ${errorMessage}`,
                usersAdded: 0,
                coursesAdded: 0,
                blogPostsAdded: 0,
                jobsAdded: 0,
                toolsAdded: 0,
                pricingPlansAdded: 0,
                testimonialsAdded: 0,
            };
        }
    }
    
    const db = getFirestore();
    const batch = db.batch();
    let usersAdded = 0;
    let coursesAdded = 0;
    let blogPostsAdded = 0;
    let jobsAdded = 0;
    let toolsAdded = 0;
    let pricingPlansAdded = 0;
    let testimonialsAdded = 0;

    try {
      // Seed Users
      const usersCollection = db.collection('users');
      users.forEach(user => {
        const docRef = usersCollection.doc(user.uid); // Use predefined UID
        batch.set(docRef, user);
        usersAdded++;
      });

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
      
      const message = `Successfully seeded data: ${usersAdded} users, ${coursesAdded} courses, ${blogPostsAdded} blog posts, ${jobsAdded} jobs, ${toolsAdded} tools, ${pricingPlansAdded} pricing plans, ${testimonialsAdded} testimonials.`;
      console.log(message);
      return {
        success: true,
        message,
        usersAdded,
        coursesAdded,
        blogPostsAdded,
        jobsAdded,
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
          usersAdded: 0,
          coursesAdded: 0,
          blogPostsAdded: 0,
          jobsAdded: 0,
          toolsAdded: 0,
          pricingPlansAdded: 0,
          testimonialsAdded: 0,
        };
      }
       return {
          success: false,
          message: 'An unknown error occurred during data seeding.',
          usersAdded: 0,
          coursesAdded: 0,
          blogPostsAdded: 0,
          jobsAdded: 0,
          toolsAdded: 0,
          pricingPlansAdded: 0,
          testimonialsAdded: 0,
        };
    }
  }
);
