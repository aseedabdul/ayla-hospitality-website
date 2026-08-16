import { db } from "../db/database.js";

// Get all brands
export async function getBrands(req, res) {
  try {
    const rows = await db.all(`SELECT name FROM brands ORDER BY name ASC`);
    const brands = rows.map((r) => r.name);
    return res.json({ brands });
  } catch (err) {
    console.error("GetBrands error:", err);
    return res.status(500).json({ error: "Failed to fetch brands" });
  }
}
