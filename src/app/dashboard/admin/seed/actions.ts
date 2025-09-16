
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
import bcryptjs from 'bcryptjs';

async function createTables() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        role VARCHAR(10) DEFAULT 'user',
        credits INT DEFAULT 100,
        profile_image VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        plan_id VARCHAR(50),
        bookmarks JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        phone VARCHAR(20)
      );
    `);
     console.log("✔️ `users` table created or already exists.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(10, 2)
      );
    `);
    console.log("✔️ `packages` table created or already exists.");

    await client.query(`
        CREATE TABLE IF NOT EXISTS tools (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            href VARCHAR(255) NOT NULL,
            icon VARCHAR(255),
            category VARCHAR(255),
            enabled BOOLEAN DEFAULT TRUE,
            isFree BOOLEAN DEFAULT TRUE,
            credits INT DEFAULT 0
        );
    `);
    console.log("✔️ `tools` table created or already exists.");

    await client.query(`
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255),
            instructor VARCHAR(255),
            price DECIMAL(10, 2),
            level VARCHAR(50),
            duration VARCHAR(50),
            image VARCHAR(255),
            dataAiHint VARCHAR(255)
        );
    `);
     console.log("✔️ `courses` table created or already exists.");

     await client.query(`
        CREATE TABLE IF NOT EXISTS pricing_plans (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2),
            originalPrice DECIMAL(10, 2),
            discount VARCHAR(255),
            description TEXT,
            credits INT,
            validity VARCHAR(255),
            isPopular BOOLEAN DEFAULT FALSE,
            features JSONB
        );
     `);
    console.log("✔️ `pricing_plans` table created or already exists.");

    await client.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id SERIAL PRIMARY KEY,
            feature VARCHAR(255),
            quote TEXT,
            metric VARCHAR(255),
            authorName VARCHAR(255),
            authorRole VARCHAR(255),
            avatar VARCHAR(255),
            dataAiHint VARCHAR(255)
        );
    `);
    console.log("✔️ `testimonials` table created or already exists.");
    
    await client.query(`
        CREATE TABLE IF NOT EXISTS coupons (
            id SERIAL PRIMARY KEY,
            code VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            discountPercentage DECIMAL(5, 2) NOT NULL,
            isActive BOOLEAN DEFAULT TRUE,
            validUntil TIMESTAMP,
            applicableTo JSONB
        );
    `);
    console.log("✔️ `coupons` table created or already exists.");

     await client.query(`
        CREATE TABLE IF NOT EXISTS history (
            id SERIAL PRIMARY KEY,
            user_id INT,
            tool VARCHAR(255),
            input JSONB,
            output JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
    console.log("✔️ `history` table created or already exists.");
    
    await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            toolId VARCHAR(255),
            sender VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("✔️ `notifications` table created or already exists.");

    await client.query(`
        CREATE TABLE IF NOT EXISTS tool_requests (
            id SERIAL PRIMARY KEY,
            user_id INT,
            tool_name VARCHAR(255) NOT NULL,
            tool_description TEXT,
            use_case TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
    `);
    console.log("✔️ `tool_requests` table created or already exists.");
    
    await client.query(`
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INT,
            plan_id VARCHAR(255),
            amount DECIMAL(10, 2),
            status VARCHAR(20) DEFAULT 'Pending',
            method VARCHAR(20),
            sender_number VARCHAR(20),
            transaction_id VARCHAR(255),
            screenshot_url VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("✔️ `transactions` table created or already exists.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value JSONB
      );
    `);
    console.log("✔️ `settings` table created or already exists.");
        await client.query('COMMIT');
    } catch(e) {
        await client.query('ROLLBACK');
        console.error("Error creating tables", e);
        throw e;
    } finally {
        client.release();
    }
}

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
        await createTables();

        let documentsWritten = 0;
        let tablesSkipped = 0;

        // Seed users
        if (await isTableEmpty('users')) {
            const password = await bcryptjs.hash('password123', 10);
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
