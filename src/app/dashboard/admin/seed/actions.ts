
'use server';

import { getCurrentUser } from '@/services/user-service';
import pool from '@/lib/mysql';
import {
  tools,
  allCourses,
  blogPosts,
  jobPostings,
  pricingPlans,
  testimonials,
  users
} from '@/lib/demo-data';

async function tableExists(tableName: string): Promise<boolean> {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?', [process.env.DB_NAME || 'totthoai', tableName]);
        return (rows as any)[0].count > 0;
    } catch {
        return false;
    }
}

async function isTableEmpty(tableName: string): Promise<boolean> {
    try {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        return (rows as any)[0].count === 0;
    } catch {
        // If table doesn't exist, it's "empty" for seeding purposes
        return true;
    }
}


export async function seedDatabaseAction() {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        return { success: false, message: 'Permission denied. You must be an admin to seed the database.' };
    }

    try {
        let documentsWritten = 0;
        let collectionsSkipped = 0;

        // Note: Seeding is idempotent because of INSERT ... ON DUPLICATE KEY UPDATE or checking if table is empty.

        if (await isTableEmpty('users')) {
            const seededUsers = users.map(u => [u.name, u.email, u.password, u.role]);
             await pool.query('INSERT INTO users (name, email, password, role) VALUES ?', [seededUsers]);
             documentsWritten += users.length;
        } else {
            collectionsSkipped++;
        }

        if (await isTableEmpty('tools')) {
            const seededTools = tools.map(t => [t.title, t.description, t.href, t.icon, t.category, t.enabled, t.isFree, t.credits]);
            await pool.query('INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits) VALUES ?', [seededTools]);
            documentsWritten += tools.length;
        } else {
            collectionsSkipped++;
        }

        if (await isTableEmpty('courses')) {
            const seededCourses = allCourses.map(c => [c.title, c.category, c.instructor, c.price, c.level, c.duration, c.image, c.dataAiHint]);
            await pool.query('INSERT INTO courses (title, category, instructor, price, level, duration, image, dataAiHint) VALUES ?', [seededCourses]);
            documentsWritten += allCourses.length;
        } else {
            collectionsSkipped++;
        }
        
        if (await isTableEmpty('pricing_plans')) {
            const seededPlans = pricingPlans.map(p => [p.name, p.price, p.originalPrice, p.discount, p.description, p.credits, p.validity, p.isPopular, JSON.stringify(p.features)]);
            await pool.query('INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features) VALUES ?', [seededPlans]);
            documentsWritten += pricingPlans.length;
        } else {
            collectionsSkipped++;
        }

        if (await isTableEmpty('testimonials')) {
            const seededTestimonials = testimonials.map(t => [t.feature, t.quote, t.metric, t.authorName, t.authorRole, t.avatar, t.dataAiHint]);
            await pool.query('INSERT INTO testimonials (feature, quote, metric, authorName, authorRole, avatar, dataAiHint) VALUES ?', [seededTestimonials]);
            documentsWritten += testimonials.length;
        } else {
            collectionsSkipped++;
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
