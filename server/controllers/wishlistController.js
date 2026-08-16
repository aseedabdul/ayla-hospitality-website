import { db } from "../db/database.js";

// Helper: Get or create wishlist
async function getOrCreateWishlist(userId, sessionToken) {
  let wishlist = null;
  if (userId) {
    wishlist = await db.get(`SELECT * FROM wishlists WHERE user_id = ?`, [userId]);
    if (!wishlist) {
      const id = `wl-${Date.now()}`;
      await db.run(
        `INSERT INTO wishlists (id, user_id, session_token) VALUES (?, ?, ?)`,
        [id, userId, sessionToken || null]
      );
      wishlist = await db.get(`SELECT * FROM wishlists WHERE id = ?`, [id]);
    }
  } else if (sessionToken) {
    wishlist = await db.get(`SELECT * FROM wishlists WHERE session_token = ?`, [sessionToken]);
    if (!wishlist) {
      const id = `wl-${Date.now()}`;
      await db.run(
        `INSERT INTO wishlists (id, user_id, session_token) VALUES (?, NULL, ?)`,
        [id, sessionToken]
      );
      wishlist = await db.get(`SELECT * FROM wishlists WHERE id = ?`, [id]);
    }
  }
  return wishlist;
}

// 1. Get Wishlist
export async function getWishlist(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.query.sessionToken || null;

    if (!userId && !sessionToken) {
      return res.json({ ids: [], items: [] });
    }

    const wishlist = await getOrCreateWishlist(userId, sessionToken);
    if (!wishlist) {
      return res.json({ ids: [], items: [] });
    }

    const rows = await db.all(
      `SELECT wi.id as item_id, p.*, c.name as category_name
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE wi.wishlist_id = ?
       ORDER BY wi.created_at DESC`,
      [wishlist.id]
    );

    const ids = rows.map((r) => r.id);
    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      brand: r.brand_name,
      category: r.category_id,
      categoryName: r.category_name,
      size: r.size,
      price: Number(r.price),
      currency: r.currency || "$",
      description: r.description,
      image: r.image,
      available: Boolean(r.available),
      tag: r.tag,
    }));

    return res.json({ ids, items });
  } catch (err) {
    console.error("GetWishlist error:", err);
    return res.status(500).json({ error: "Failed to fetch wishlist" });
  }
}

// 2. Toggle Item in Wishlist
export async function toggleWishlist(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || null;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const wishlist = await getOrCreateWishlist(userId, sessionToken || `sess-${Date.now()}`);

    const existing = await db.get(
      `SELECT * FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?`,
      [wishlist.id, productId]
    );

    if (existing) {
      await db.run(`DELETE FROM wishlist_items WHERE id = ?`, [existing.id]);
    } else {
      const itemId = `wli-${Date.now()}`;
      await db.run(
        `INSERT INTO wishlist_items (id, wishlist_id, product_id) VALUES (?, ?, ?)`,
        [itemId, wishlist.id, productId]
      );
    }

    return getWishlist(req, res);
  } catch (err) {
    console.error("ToggleWishlist error:", err);
    return res.status(500).json({ error: "Failed to update wishlist" });
  }
}

// 3. Remove Item
export async function removeItem(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || null;
    const { productId } = req.params;

    const wishlist = await getOrCreateWishlist(userId, sessionToken);
    if (wishlist) {
      await db.run(
        `DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?`,
        [wishlist.id, productId]
      );
    }

    return getWishlist(req, res);
  } catch (err) {
    console.error("RemoveWishlist error:", err);
    return res.status(500).json({ error: "Failed to remove wishlist item" });
  }
}
