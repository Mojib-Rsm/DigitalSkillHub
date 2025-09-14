
import 'dotenv/config';
import pool from "../src/lib/mysql";
import bcrypt from 'bcrypt';

async function seed() {
  console.log("🌱 Starting database seeding...");
  try {
    // Create tables first
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

    // Then seed the data
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
    console.log("👤 Users seeded.");

    await pool.query(`
        INSERT INTO packages (name, description, price) VALUES
        ("Shop Package", "Tools for printing/photo shops", 499),
        ("Creator Package", "Content creators tools", 999)
        ON DUPLICATE KEY UPDATE 
            description=VALUES(description), 
            price=VALUES(price);
    `);
    console.log("📦 Packages seeded.");

    console.log("✅ Seeding complete");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await pool.end(); // Close the connection pool
    process.exit();
  }
}

seed();
