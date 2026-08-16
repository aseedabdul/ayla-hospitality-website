import { db } from "../db/database.js";

// Admin dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const productCountRow = await db.get(`SELECT COUNT(*) as count FROM products WHERE is_active = 1`);
    const lowStockRows = await db.all(
      `SELECT p.id, p.name, p.brand_name, p.image, p.price, COALESCE(i.stock_quantity, 0) as stock
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.is_active = 1 AND COALESCE(i.stock_quantity, 0) <= 5`
    );
    const categoryCountRow = await db.get(`SELECT COUNT(*) as count FROM categories`);
    const brandCountRow = await db.get(`SELECT COUNT(*) as count FROM brands`);

    return res.json({
      stats: {
        totalProducts: Number(productCountRow.count || 0),
        lowStockCount: lowStockRows.length,
        totalCategories: Number(categoryCountRow.count || 0),
        totalBrands: Number(brandCountRow.count || 0),
      },
      lowStockProducts: lowStockRows.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand_name,
        image: p.image,
        price: Number(p.price),
        stock: Number(p.stock),
      })),
    });
  } catch (err) {
    console.error("GetDashboardStats error:", err);
    return res.status(500).json({ error: "Failed to fetch admin stats" });
  }
}
