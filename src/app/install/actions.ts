
"use server";

import { z } from 'zod';
import pool from '@/lib/mysql';
import bcryptjs from 'bcryptjs';
import { redirect } from 'next/navigation';
import {
  tools as demoTools,
  pricingPlans as demoPricingPlans,
} from '@/lib/demo-data';

const SetupSchema = z.object({
    language: z.string(),
    photo_size: z.string(),
    bg_color: z.string(),
    max_file_size: z.number(),
    allowed_formats: z.array(z.string()),
    storage_provider: z.string(),
    admin_name: z.string().min(3, "Admin name must be at least 3 characters."),
    admin_email: z.string().email("Please enter a valid email."),
    admin_password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string(),
}).refine(data => data.admin_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
});

async function setupDatabase() {
    const tables = [
        'history', 'tool_requests', 'transactions', 'users', 
        'coupons', 'courses', 'notifications', 'packages', 
        'pricing_plans', 'settings', 'testimonials', 'tools'
    ];

    // Drop tables in reverse order of creation to handle foreign key constraints
    for (const table of tables) {
        await pool.query(`DROP TABLE IF EXISTS ${'\'\'\''}${table}\'\'\'';`);
        console.log(`✔️ Table ${table} dropped.`);
    }
    
    // Create tables
    await pool.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        role ENUM('user', 'admin') DEFAULT 'user',
        credits INT DEFAULT 100,
        profile_image VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        plan_id VARCHAR(50),
        bookmarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        phone VARCHAR(20)
      );
    `);
    console.log("✔️ `users` table created.");

    await pool.query(`
        CREATE TABLE tools (
            id INT AUTO_INCREMENT PRIMARY KEY,
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
    console.log("✔️ `tools` table created.");
    
    await pool.query(`
        CREATE TABLE pricing_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2),
            originalPrice DECIMAL(10, 2),
            discount VARCHAR(255),
            description TEXT,
            credits INT,
            validity VARCHAR(255),
            isPopular BOOLEAN DEFAULT FALSE,
            features TEXT
        );
    `);
    console.log("✔️ `pricing_plans` table created.");

    await pool.query(`
      CREATE TABLE settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value TEXT
      );
    `);
    console.log("✔️ `settings` table created.");

    await pool.query(`CREATE TABLE history (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, tool VARCHAR(255), input TEXT, output TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);`);
    console.log("✔️ `history` table created.");
    
    await pool.query(`CREATE TABLE tool_requests (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, tool_name VARCHAR(255) NOT NULL, tool_description TEXT, use_case TEXT, status VARCHAR(50) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL);`);
    console.log("✔️ `tool_requests` table created.");
    
    await pool.query(`CREATE TABLE transactions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, plan_id VARCHAR(255), amount DECIMAL(10, 2), status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending', method ENUM('bKash', 'Nagad', 'Manual'), sender_number VARCHAR(20), transaction_id VARCHAR(255), screenshot_url VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL);`);
    console.log("✔️ `transactions` table created.");

    // Seed initial data
    const seededTools = demoTools.map(t => [t.title, t.description, t.href, t.icon, t.category, t.enabled, t.isFree, t.credits]);
    await pool.query(`INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits) VALUES ?`, [seededTools]);
    console.log("🛠️ Tools seeded.");

    const seededPlans = demoPricingPlans.map(p => [p.name, p.price, p.originalPrice, p.discount, p.description, p.credits, p.validity, p.isPopular, JSON.stringify(p.features)]);
    await pool.query(`INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features) VALUES ?`, [seededPlans]);
    console.log("💲 Pricing plans seeded.");
}


export async function finishSetupAction(data: z.infer<typeof SetupSchema>) {
    const validatedFields = SetupSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            issues: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await setupDatabase();
        
        const { admin_name, admin_email, admin_password, ...settings } = validatedFields.data;
        
        // 1. Save settings to the database
        const settingsToSave = [
            ['language', settings.language],
            ['photo_size_standard', settings.photo_size],
            ['default_background_color', settings.bg_color],
            ['max_upload_size_mb', settings.max_file_size.toString()],
            ['allowed_formats', JSON.stringify(settings.allowed_formats)],
            ['storage_provider', settings.storage_provider],
        ];

        for (const [key, value] of settingsToSave) {
            await pool.query(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
                [key, value]
            );
        }
        console.log("⚙️ App settings saved.");

        // 2. Create the admin user
        const hashedPassword = await bcryptjs.hash(admin_password, 10);
        await pool.query(
            "INSERT INTO users (name, email, password, role, credits, plan_id) VALUES (?, ?, ?, ?, ?, ?)",
            [admin_name, admin_email, hashedPassword, 'admin', 9999, 'sigma']
        );
        console.log("👤 Admin user created.");

    } catch (error) {
        console.error("Setup failed:", error);
        return { success: false, message: (error as Error).message };
    }
    
    // 3. Redirect to dashboard
    redirect('/dashboard');

    return { success: true, message: "Setup completed successfully." };
}
