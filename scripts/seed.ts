
import 'dotenv/config';
import pool from "../src/lib/mysql";
import bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Seed users
    const password = await bcrypt.hash('password123', 10);
    await pool.query(`
        INSERT INTO users (name, email, password, role) VALUES
        ("Admin User", "admin@example.com", ?, "admin"),
        ("Test User", "user@example.com", ?, "user")
        ON DUPLICATE KEY UPDATE 
            name=VALUES(name),
            password=VALUES(password),
            role=VALUES(role);
    `, [password, password]);

    // Seed packages
    await pool.query(`
        INSERT INTO packages (name, description, price) VALUES
        ("Shop Package", "Tools for printing/photo shops", 499),
        ("Creator Package", "Content creators tools", 999)
        ON DUPLICATE KEY UPDATE 
            description=VALUES(description), 
            price=VALUES(price);
    `);

    console.log("✅ Seeding complete");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await pool.end(); // Close the connection pool
    process.exit();
  }
}

seed();
