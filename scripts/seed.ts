
import 'dotenv/config';
import pool from "../src/lib/db";
import bcrypt from 'bcryptjs';
import {
  tools,
  allCourses,
  pricingPlans,
  testimonials,
  users
} from '../src/lib/demo-data';

async function seed() {
  console.log("🌱 Starting database seeding for PostgreSQL...");
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create tables if they don't exist
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

    // Seed settings
    await client.query(`
      INSERT INTO settings (setting_key, setting_value) VALUES
      ('payment_method_bkash', '{"number": "01800000000", "type": "Personal"}'),
      ('payment_method_nagad', '{"number": "01900000000", "type": "Personal"}')
      ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
    `);
    console.log("⚙️ Settings seeded.");


    // Seed users
    const password = await bcrypt.hash('password123', 10);
    for (const user of users) {
        await client.query(`
            INSERT INTO users (name, email, password, role, credits, plan_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            password = EXCLUDED.password,
            role = EXCLUDED.role,
            credits = EXCLUDED.credits,
            plan_id = EXCLUDED.plan_id;
        `, [user.name, user.email, password, user.role, user.credits, user.plan_id]);
    }
    console.log("👤 Users seeded.");


    // Seed packages
    await client.query(`
        INSERT INTO packages (name, description, price) VALUES
        ('Shop Package', 'Tools for printing/photo shops', 499),
        ('Creator Package', 'Content creators tools', 999)
        ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        price = EXCLUDED.price;
    `);
    console.log("📦 Packages seeded.");
    
    // Seed tools
    for (const tool of tools) {
        await client.query(`
            INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (title) DO UPDATE SET
            description = EXCLUDED.description,
            href = EXCLUDED.href,
            icon = EXCLUDED.icon,
            category = EXCLUDED.category,
            enabled = EXCLUDED.enabled,
            isFree = EXCLUDED.isFree,
            credits = EXCLUDED.credits;
        `, [tool.title, tool.description, tool.href, tool.icon, tool.category, tool.enabled, tool.isFree, tool.credits]);
    }
    console.log("🛠️ Tools seeded.");

    // Seed courses
    for (const course of allCourses) {
        await client.query(`
            INSERT INTO courses (title, category, instructor, price, level, duration, image, dataAiHint)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO NOTHING; -- Assuming title is not unique, using id
        `, [course.title, course.category, course.instructor, course.price, course.level, course.duration, course.image, course.dataAiHint]);
    }
    console.log("🎓 Courses seeded.");

    // Seed pricing plans
    for (const plan of pricingPlans) {
        await client.query(`
            INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (name) DO UPDATE SET
            price = EXCLUDED.price,
            originalPrice = EXCLUDED.originalPrice,
            discount = EXCLUDED.discount,
            description = EXCLUDED.description,
            credits = EXCLUDED.credits,
            validity = EXCLUDED.validity,
            isPopular = EXCLUDED.isPopular,
            features = EXCLUDED.features;
        `, [plan.name, plan.price, plan.originalPrice, plan.discount, plan.description, plan.credits, plan.validity, plan.isPopular, JSON.stringify(plan.features)]);
    }
    console.log("💲 Pricing plans seeded.");

    // Seed testimonials
    for (const t of testimonials) {
        await client.query(`
            INSERT INTO testimonials (feature, quote, metric, authorName, authorRole, avatar, dataAiHint)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING; -- Assuming feature is not unique, using id
        `, [t.feature, t.quote, t.metric, t.authorName, t.authorRole, t.avatar, t.dataAiHint]);
    }
    console.log("💬 Testimonials seeded.");

    await client.query('COMMIT');
    console.log("✅ Seeding complete");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Seeding error:", error);
  } finally {
    client.release();
    await pool.end();
    process.exit();
  }
}

seed();
