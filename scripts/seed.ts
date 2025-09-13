
import 'dotenv/config';
import pool from "../src/lib/mysql";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Example: insert packages with idempotent query
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
