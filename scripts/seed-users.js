require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function seedUsers() {
  try {
    console.log("Starting user seeding...");

    // Check if admin exists
    const existingAdmin = await pool.query(
      "SELECT id FROM users WHERE username = 'admin' AND deleted_at IS NULL"
    );

    if (existingAdmin.rows.length === 0) {
      const adminId = `user-${nanoid(16)}`;
      const hashedPassword = await bcrypt.hash("Admin123!", 10);

      await pool.query(
        "INSERT INTO users (id, username, password, fullname, role) VALUES ($1, $2, $3, $4, $5)",
        [adminId, "admin", hashedPassword, "System Administrator", "admin"]
      );

      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️  Admin user already exists, skipping...");
    }

    // Check if staff exists
    const existingStaff = await pool.query(
      "SELECT id FROM users WHERE username = 'staff' AND deleted_at IS NULL"
    );

    if (existingStaff.rows.length === 0) {
      const staffId = `user-${nanoid(16)}`;
      const hashedPassword = await bcrypt.hash("Staff123!", 10);

      await pool.query(
        "INSERT INTO users (id, username, password, fullname, role) VALUES ($1, $2, $3, $4, $5)",
        [staffId, "staff", hashedPassword, "Medical Staff", "staff"]
      );

      console.log("✅ Staff user created successfully");
    } else {
      console.log("ℹ️  Staff user already exists, skipping...");
    }

    console.log("✅ User seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedUsers();
