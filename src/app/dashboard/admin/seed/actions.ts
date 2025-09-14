
'use server';

import { getCurrentUser } from '@/services/user-service';
import pool from '@/lib/mysql';
import {
  tools,
  allCourses,
  pricingPlans,
  testimonials,
  users
} from '@/lib/demo-data';
import bcrypt from 'bcrypt';

async function isTableEmpty(tableName: string): Promise<boolean> {
    try {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        // @ts-ignore
        return rows[0].count === 0;
    } catch (error) {
        console.warn(`Could not check if table ${tableName} is empty, it might not exist.`, error);
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
        let tablesSkipped = 0;

        // Note: Seeding is idempotent because of INSERT ... ON DUPLICATE KEY UPDATE.

        // Seed users
        if (await isTableEmpty('users')) {
            const password = await bcrypt.hash('password123', 10);
            const seededUsers = users.map(u => [u.name, u.email, password, u.role, u.credits, u.plan_id]);
            await pool.query(`
                INSERT INTO users (name, email, password, role, credits, plan_id) VALUES ?
            `, [seededUsers]);
            documentsWritten += users.length;
            console.log("👤 Users seeded.");
        } else {
            tablesSkipped++;
        }
        
        // Seed packages (if you have a packages table)
        if (await isTableEmpty('packages')) {
            await pool.query(`
                INSERT INTO packages (name, description, price) VALUES
                ("Shop Package", "Tools for printing/photo shops", 499),
                ("Creator Package", "Content creators tools", 999);
            `);
            documentsWritten += 2;
            console.log("📦 Packages seeded.");
        } else {
             tablesSkipped++;
        }
        
        // Seed tools
        if (await isTableEmpty('tools')) {
            const seededTools = tools.map(t => [t.title, t.description, t.href, t.icon, t.category, t.enabled, t.isFree, t.credits]);
            await pool.query(`
                INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits) VALUES ?
            `, [seededTools]);
            documentsWritten += tools.length;
            console.log("🛠️ Tools seeded.");
        } else {
             tablesSkipped++;
        }

        // Seed courses
        if (await isTableEmpty('courses')) {
            const seededCourses = allCourses.map(c => [c.title, c.category, c.instructor, c.price, c.level, c.duration, c.image, c.dataAiHint]);
            await pool.query(`
                INSERT INTO courses (title, category, instructor, price, level, duration, image, dataAiHint) VALUES ?
            `, [seededCourses]);
            documentsWritten += allCourses.length;
            console.log("🎓 Courses seeded.");
        } else {
            tablesSkipped++;
        }

        // Seed pricing plans
        if (await isTableEmpty('pricing_plans')) {
            const seededPlans = pricingPlans.map(p => [p.name, p.price, p.originalPrice, p.discount, p.description, p.credits, p.validity, p.isPopular, JSON.stringify(p.features)]);
            await pool.query(`
                INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features) VALUES ?
            `, [seededPlans]);
            documentsWritten += pricingPlans.length;
            console.log("💲 Pricing plans seeded.");
        } else {
            tablesSkipped++;
        }

        // Seed testimonials
        if (await isTableEmpty('testimonials')) {
            const seededTestimonials = testimonials.map(t => [t.feature, t.quote, t.metric, t.authorName, t.authorRole, t.avatar, t.dataAiHint]);
            await pool.query(`
                INSERT INTO testimonials (feature, quote, metric, authorName, authorRole, avatar, dataAiHint) VALUES ?
            `, [seededTestimonials]);
            documentsWritten += testimonials.length;
            console.log("💬 Testimonials seeded.");
        } else {
            tablesSkipped++;
        }

        if (documentsWritten === 0 && tablesSkipped > 0) {
             return { success: true, message: `Database is already up to date. No new data was seeded into the ${tablesSkipped} existing tables.` };
        }

        return { success: true, message: `Successfully seeded ${documentsWritten} new documents.` };

    } catch (error) {
        console.error("Error seeding database:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Database seeding failed: ${errorMessage}` };
    }
}
