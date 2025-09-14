
import 'dotenv/config';
import pool from "../src/lib/mysql";
import bcrypt from 'bcrypt';
import {
  tools,
  allCourses,
  pricingPlans,
  testimonials,
  users
} from '../src/lib/demo-data';

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

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
