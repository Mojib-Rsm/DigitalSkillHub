
'use server';

import { getCurrentUser } from '@/services/user-service';
import pool from '@/lib/db';
import {
  tools,
  allCourses,
  pricingPlans,
  testimonials,
  users
} from '@/lib/demo-data';
import bcrypt from 'bcryptjs';

async function isTableEmpty(tableName: string): Promise<boolean> {
    try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        return result.rows[0].count === '0';
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
            for (const user of users) {
                await pool.query(
                    'INSERT INTO users (name, email, password, role, credits, plan_id) VALUES ($1, $2, $3, $4, $5, $6)',
                    [user.name, user.email, password, user.role, user.credits, user.plan_id]
                );
            }
            documentsWritten += users.length;
            console.log("👤 Users seeded.");
        } else {
            tablesSkipped++;
        }
        
        // Seed packages (if you have a packages table)
        if (await isTableEmpty('packages')) {
            await pool.query(`
                INSERT INTO packages (name, description, price) VALUES
                ('Shop Package', 'Tools for printing/photo shops', 499),
                ('Creator Package', 'Content creators tools', 999)
            `);
            documentsWritten += 2;
            console.log("📦 Packages seeded.");
        } else {
             tablesSkipped++;
        }
        
        // Seed tools
        if (await isTableEmpty('tools')) {
            for (const tool of tools) {
                await pool.query(
                    'INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [tool.title, tool.description, tool.href, tool.icon, tool.category, tool.enabled, tool.isFree, tool.credits]
                );
            }
            documentsWritten += tools.length;
            console.log("🛠️ Tools seeded.");
        } else {
             tablesSkipped++;
        }

        // Seed courses
        if (await isTableEmpty('courses')) {
             for (const course of allCourses) {
                await pool.query(
                    'INSERT INTO courses (title, category, instructor, price, level, duration, image, dataAiHint) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [course.title, course.category, course.instructor, course.price, course.level, course.duration, course.image, course.dataAiHint]
                );
            }
            documentsWritten += allCourses.length;
            console.log("🎓 Courses seeded.");
        } else {
            tablesSkipped++;
        }

        // Seed pricing plans
        if (await isTableEmpty('pricing_plans')) {
            for (const plan of pricingPlans) {
                await pool.query(
                    'INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                    [plan.name, plan.price, plan.originalPrice, plan.discount, plan.description, plan.credits, plan.validity, plan.isPopular, JSON.stringify(plan.features)]
                );
            }
            documentsWritten += pricingPlans.length;
            console.log("💲 Pricing plans seeded.");
        } else {
            tablesSkipped++;
        }

        // Seed testimonials
        if (await isTableEmpty('testimonials')) {
            for (const t of testimonials) {
                await pool.query(
                    'INSERT INTO testimonials (feature, quote, metric, authorName, authorRole, avatar, dataAiHint) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [t.feature, t.quote, t.metric, t.authorName, t.authorRole, t.avatar, t.dataAiHint]
                );
            }
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
