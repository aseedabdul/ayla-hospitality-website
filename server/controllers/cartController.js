import { db } from "../db/database.js";

// Helper: Get or create user/session cart
async function getOrCreateCart(userId, sessionToken) {
  let cart = null;
  if (userId) {
    cart = await db.get(`SELECT * FROM carts WHERE user_id = ?`, [userId]);
    if (!cart) {
      const cartId = `cart-${Date.now()}`;
      await db.run(
        `INSERT INTO carts (id, user_id, session_token) VALUES (?, ?, ?)`,
        [cartId, userId, sessionToken || null]
      );
      cart = await db.get(`SELECT * FROM carts WHERE id = ?`, [cartId]);
    }
  } else if (sessionToken) {
    cart = await db.get(`SELECT * FROM carts WHERE session_token = ?`, [sessionToken]);
    if (!cart) {
      const cartId = `cart-${Date.now()}`;
      await db.run(
        `INSERT INTO carts (id, user_id, session_token) VALUES (?, NULL, ?)`,
        [cartId, sessionToken]
      );
      cart = await db.get(`SELECT * FROM carts WHERE id = ?`, [cartId]);
    }
  }
  return cart;
}

// Helper: Calculate cart pricing server-side
function calculateCartTotals(items, discountCode) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const normalizedCode = discountCode ? discountCode.trim().toUpperCase() : null;
  let discountRate = 0;
  let isFreeDelivery = false;

  if (normalizedCode === "AYLA-NIGHT10") discountRate = 0.1;
  else if (normalizedCode === "AYLA-WELL15") discountRate = 0.15;
  else if (normalizedCode === "AYLA-WELCOME") isFreeDelivery = true;

  const discountAmount = subtotal * discountRate;
  const deliveryFee =
    subtotal === 0 || subtotal >= 40 || isFreeDelivery ? 0 : 3.5;
  const total = Math.max(subtotal - discountAmount + deliveryFee, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    discountCode: normalizedCode,
    deliveryFee: Number(deliveryFee.toFixed(2)),
    total: Number(total.toFixed(2)),
    itemCount,
  };
}

// 1. Get Cart
export async function getCart(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.query.sessionToken || null;

    if (!userId && !sessionToken) {
      return res.json({
        items: [],
        subtotal: 0,
        discountAmount: 0,
        discountCode: null,
        deliveryFee: 0,
        total: 0,
        itemCount: 0,
      });
    }

    const cart = await getOrCreateCart(userId, sessionToken);
    if (!cart) {
      return res.json({
        items: [],
        subtotal: 0,
        discountAmount: 0,
        discountCode: null,
        deliveryFee: 0,
        total: 0,
        itemCount: 0,
      });
    }

    const cartItemRows = await db.all(
      `SELECT ci.*, 
              p.name, p.brand_name, p.category_id, p.size, p.price as current_price,
              p.currency, p.description, p.image, p.available,
              COALESCE(i.stock_quantity, 0) as stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE ci.cart_id = ?
       ORDER BY ci.created_at ASC`,
      [cart.id]
    );

    const items = cartItemRows.map((row) => ({
      id: row.id,
      quantity: row.quantity,
      qty: row.quantity, // compatibility with frontend shape
      product: {
        id: row.product_id,
        name: row.name,
        brand: row.brand_name,
        category: row.category_id,
        size: row.size,
        price: Number(row.current_price),
        currency: row.currency || "$",
        description: row.description,
        image: row.image,
        available: Boolean(row.available),
        stock: Number(row.stock),
      },
    }));

    const totals = calculateCartTotals(items, cart.discount_code);

    return res.json({
      cartId: cart.id,
      items,
      ...totals,
    });
  } catch (err) {
    console.error("GetCart error:", err);
    return res.status(500).json({ error: "Failed to load cart" });
  }
}

// 2. Add Item to Cart
export async function addItem(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || null;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Verify product exists and is available
    const product = await db.get(
      `SELECT p.*, COALESCE(i.stock_quantity, 0) as stock
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.id = ? AND p.is_active = 1`,
      [productId]
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.available || product.stock < 1) {
      return res.status(400).json({ error: "Item is currently out of stock." });
    }

    const cart = await getOrCreateCart(userId, sessionToken || `sess-${Date.now()}`);

    const existingItem = await db.get(
      `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`,
      [cart.id, productId]
    );

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingItem) {
      const newQty = existingItem.quantity + qtyToAdd;
      if (newQty > product.stock) {
        return res.status(400).json({ error: `Cannot add more than available stock (${product.stock}).` });
      }
      await db.run(
        `UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [newQty, existingItem.id]
      );
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({ error: `Cannot add more than available stock (${product.stock}).` });
      }
      const itemId = `ci-${Date.now()}`;
      await db.run(
        `INSERT INTO cart_items (id, cart_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)`,
        [itemId, cart.id, productId, qtyToAdd, product.price]
      );
    }

    return getCart(req, res);
  } catch (err) {
    console.error("AddItem error:", err);
    return res.status(500).json({ error: "Failed to add item to cart" });
  }
}

// 3. Update Item Quantity
export async function updateQuantity(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || null;
    const { productId, quantity } = req.body;

    const cart = await getOrCreateCart(userId, sessionToken);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      await db.run(
        `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`,
        [cart.id, productId]
      );
    } else {
      // Check stock
      const inventory = await db.get(`SELECT stock_quantity FROM inventory WHERE product_id = ?`, [productId]);
      const availableStock = inventory ? inventory.stock_quantity : 999;
      if (qty > availableStock) {
        return res.status(400).json({ error: `Only ${availableStock} items in stock.` });
      }

      await db.run(
        `UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ? AND product_id = ?`,
        [qty, cart.id, productId]
      );
    }

    return getCart(req, res);
  } catch (err) {
    console.error("UpdateQuantity error:", err);
    return res.status(500).json({ error: "Failed to update quantity" });
  }
}

// 4. Remove Item from Cart
export async function removeItem(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || req.query.sessionToken || null;
    const { productId } = req.params;

    const cart = await getOrCreateCart(userId, sessionToken);
    if (cart) {
      await db.run(
        `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`,
        [cart.id, productId]
      );
    }

    return getCart(req, res);
  } catch (err) {
    console.error("RemoveItem error:", err);
    return res.status(500).json({ error: "Failed to remove item" });
  }
}

// 5. Clear Cart
export async function clearCart(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || null;

    const cart = await getOrCreateCart(userId, sessionToken);
    if (cart) {
      await db.run(`DELETE FROM cart_items WHERE cart_id = ?`, [cart.id]);
      await db.run(`UPDATE carts SET discount_code = NULL WHERE id = ?`, [cart.id]);
    }

    return res.json({ message: "Cart cleared", items: [], total: 0 });
  } catch (err) {
    console.error("ClearCart error:", err);
    return res.status(500).json({ error: "Failed to clear cart" });
  }
}

// 6. Apply Promo Code
export async function applyDiscount(req, res) {
  try {
    const userId = req.user?.id || null;
    const sessionToken = req.headers["x-session-token"] || req.body.sessionToken || null;
    const { code } = req.body;

    const normalized = (code || "").trim().toUpperCase();
    const validCodes = ["AYLA-WELCOME", "AYLA-NIGHT10", "AYLA-WELL15"];

    if (!validCodes.includes(normalized)) {
      return res.status(400).json({ ok: false, error: "Invalid or expired promo code." });
    }

    const cart = await getOrCreateCart(userId, sessionToken);
    if (cart) {
      await db.run(`UPDATE carts SET discount_code = ? WHERE id = ?`, [normalized, cart.id]);
    }

    return getCart(req, res);
  } catch (err) {
    console.error("ApplyDiscount error:", err);
    return res.status(500).json({ error: "Failed to apply discount" });
  }
}
