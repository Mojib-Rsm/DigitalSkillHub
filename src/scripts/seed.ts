

import 'dotenv/config';
import pool from "../src/lib/mysql";
import bcrypt from 'bcryptjs';
import {
  tools,
  allCourses,
  pricingPlans,
  testimonials,
  users
} from '../src/lib/demo-data';

async function seed() {
  console.log("🌱 Starting database seeding...");
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
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
     console.log("✔️ `users` table created or already exists.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(10, 2)
      );
    `);
    console.log("✔️ `packages` table created or already exists.");

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
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

     await pool.query(`
        CREATE TABLE IF NOT EXISTS pricing_plans (
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
    console.log("✔️ `pricing_plans` table created or already exists.");

    await pool.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
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
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS coupons (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            discountPercentage DECIMAL(5, 2) NOT NULL,
            isActive BOOLEAN DEFAULT TRUE,
            validUntil DATETIME,
            applicableTo TEXT
        );
    `);
    console.log("✔️ `coupons` table created or already exists.");

     await pool.query(`
        CREATE TABLE IF NOT EXISTS history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            tool VARCHAR(255),
            input TEXT,
            output TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
    console.log("✔️ `history` table created or already exists.");
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            toolId VARCHAR(255),
            sender VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("✔️ `notifications` table created or already exists.");

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tool_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            tool_name VARCHAR(255) NOT NULL,
            tool_description TEXT,
            use_case TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
    `);
    console.log("✔️ `tool_requests` table created or already exists.");


    // Seed users
    const password = await bcrypt.hash('password123', 10);
    const seededUsers = users.map(u => [u.name, u.email, password, u.role, u.credits, u.plan_id]);
     await pool.query(`
        INSERT INTO users (name, email, password, role, credits, plan_id) VALUES ?
        ON DUPLICATE KEY UPDATE 
            name=VALUES(name),
            password=VALUES(password),
            role=VALUES(role),
            credits=VALUES(credits),
            plan_id=VALUES(plan_id)
     `, [seededUsers]);
    console.log("👤 Users seeded.");


    // Seed packages (if you have a packages table)
    await pool.query(`
        INSERT INTO packages (name, description, price) VALUES
        ("Shop Package", "Tools for printing/photo shops", 499),
        ("Creator Package", "Content creators tools", 999)
        ON DUPLICATE KEY UPDATE 
            description=VALUES(description), 
            price=VALUES(price);
    `);
    console.log("📦 Packages seeded.");
    
    // Seed tools
    const seededTools = tools.map(t => [t.title, t.description, t.href, t.icon, t.category, t.enabled, t.isFree, t.credits]);
    await pool.query(`
        INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits) VALUES ?
        ON DUPLICATE KEY UPDATE 
            description=VALUES(description), 
            href=VALUES(href),
            icon=VALUES(icon),
            category=VALUES(category),
            enabled=VALUES(enabled),
            isFree=VALUES(isFree),
            credits=VALUES(credits)
    `, [seededTools]);
    console.log("🛠️ Tools seeded.");

    // Seed courses
    const seededCourses = allCourses.map(c => [c.title, c.category, c.instructor, c.price, c.level, c.duration, c.image, c.dataAiHint]);
     await pool.query(`
        INSERT INTO courses (title, category, instructor, price, level, duration, image, dataAiHint) VALUES ?
         ON DUPLICATE KEY UPDATE 
            category=VALUES(category),
            instructor=VALUES(instructor),
            price=VALUES(price),
            level=VALUES(level),
            duration=VALUES(duration),
            image=VALUES(image),
            dataAiHint=VALUES(dataAiHint)
    `, [seededCourses]);
    console.log("🎓 Courses seeded.");

    // Seed pricing plans
    const seededPlans = pricingPlans.map(p => [p.name, p.price, p.originalPrice, p.discount, p.description, p.credits, p.validity, p.isPopular, JSON.stringify(p.features)]);
    await pool.query(`
        INSERT INTO pricing_plans (name, price, originalPrice, discount, description, credits, validity, isPopular, features) VALUES ?
        ON DUPLICATE KEY UPDATE
            price=VALUES(price),
            originalPrice=VALUES(originalPrice),
            discount=VALUES(discount),
            description=VALUES(description),
            credits=VALUES(credits),
            validity=VALUES(validity),
            isPopular=VALUES(isPopular),
            features=VALUES(features)
    `, [seededPlans]);
    console.log("💲 Pricing plans seeded.");

    // Seed testimonials
    const seededTestimonials = testimonials.map(t => [t.feature, t.quote, t.metric, t.authorName, t.authorRole, t.avatar, t.dataAiHint]);
    await pool.query(`
        INSERT INTO testimonials (feature, quote, metric, authorName, authorRole, avatar, dataAiHint) VALUES ?
        ON DUPLICATE KEY UPDATE
            quote=VALUES(quote),
            metric=VALUES(metric),
            authorName=VALUES(authorName),
            authorRole=VALUES(authorRole),
            avatar=VALUES(avatar),
            dataAiHint=VALUES(dataAiHint)
    `, [seededTestimonials]);
    console.log("💬 Testimonials seeded.");


    console.log("✅ Seeding complete");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await pool.end(); // Close the connection pool
    process.exit();
  }
}

seed();
