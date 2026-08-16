import bcrypt from "bcryptjs";
import { db } from "./database.js";
import { categories } from "../../src/data/categories.js";
import { products } from "../../src/data/products.js";

export async function seedDatabase() {
  console.log("Starting AYLA Hospitality database seeding...");

  // 1. Seed Categories
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await db.run(
      `INSERT OR REPLACE INTO categories (id, slug, name, tagline, description, image, display_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [cat.id, cat.id, cat.name, cat.tagline, cat.description, cat.image, i + 1]
    );
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 2. Seed Brands
  const uniqueBrands = [...new Set(products.map((p) => p.brand))].sort();
  for (let i = 0; i < uniqueBrands.length; i++) {
    const brandName = uniqueBrands[i];
    const brandId = `b-${i + 1}`;
    await db.run(
      `INSERT OR REPLACE INTO brands (id, name) VALUES (?, ?)`,
      [brandId, brandName]
    );
  }
  console.log(`Seeded ${uniqueBrands.length} brands.`);

  // 3. Seed Products, Product Images, and Inventory
  for (const prod of products) {
    const brandObj = await db.get(`SELECT id FROM brands WHERE name = ?`, [prod.brand]);
    const brandId = brandObj ? brandObj.id : null;
    const stockQty = prod.available ? 24 : 0;

    await db.run(
      `INSERT OR REPLACE INTO products 
       (id, slug, name, brand_id, brand_name, category_id, size, price, discount, currency, description, image, available, is_active, tag, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        prod.id,
        prod.id,
        prod.name,
        brandId,
        prod.brand,
        prod.category,
        prod.size || "1 unit",
        prod.price,
        prod.discount || 0.0,
        prod.currency || "$",
        prod.description,
        prod.image,
        prod.available ? 1 : 0,
        1,
        prod.tag || null,
      ]
    );

    // Primary Product Image
    await db.run(
      `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, display_order)
       VALUES (?, ?, ?, 1, 1)`,
      [`img-${prod.id}`, prod.id, prod.image]
    );

    // Inventory
    await db.run(
      `INSERT OR REPLACE INTO inventory (id, product_id, stock_quantity, low_stock_threshold, updated_at)
       VALUES (?, ?, ?, 5, CURRENT_TIMESTAMP)`,
      [`inv-${prod.id}`, prod.id, stockQty]
    );
  }
  console.log(`Seeded ${products.length} products with inventory and images.`);

  // 4. Seed Users (Guest & Admin)
  const salt = await bcrypt.genSalt(10);

  // Guest Customer
  const guestPassHash = await bcrypt.hash("guestpassword123", salt);
  await db.run(
    `INSERT OR REPLACE INTO users (id, email, password_hash, role, updated_at)
     VALUES (?, ?, ?, 'customer', CURRENT_TIMESTAMP)`,
    ["u-001", "camille.fontaine@example.com", guestPassHash]
  );
  await db.run(
    `INSERT OR REPLACE INTO user_profiles (id, user_id, name, phone, hotel, room, tier, member_since, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      "prof-001",
      "u-001",
      "Camille Fontaine",
      "+1 (415) 555-0148",
      "The Meridian Hotel",
      "412",
      "Gold Guest",
      "2024",
    ]
  );

  // Admin User
  const adminPassHash = await bcrypt.hash("adminpassword123", salt);
  await db.run(
    `INSERT OR REPLACE INTO users (id, email, password_hash, role, updated_at)
     VALUES (?, ?, ?, 'admin', CURRENT_TIMESTAMP)`,
    ["u-admin-001", "admin@aylahospitality.com", adminPassHash]
  );
  await db.run(
    `INSERT OR REPLACE INTO user_profiles (id, user_id, name, phone, hotel, room, tier, member_since, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      "prof-admin-001",
      "u-admin-001",
      "AYLA Administrator",
      "+1 (800) 555-0199",
      "HQ Concierge Desk",
      "ADM-1",
      "Executive Staff",
      "2024",
    ]
  );
  await db.run(
    `INSERT OR REPLACE INTO admin_users (id, user_id, role, permissions)
     VALUES (?, ?, 'superadmin', 'all')`,
    ["adm-001", "u-admin-001"]
  );

  console.log("Seeded guest user (camille.fontaine@example.com) & admin user (admin@aylahospitality.com).");
  console.log("AYLA Hospitality database seeding completed successfully!");
}

// Run if called directly
if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase().catch((err) => {
    console.error("Database seeding failed:", err);
    process.exit(1);
  });
}
