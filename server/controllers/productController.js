import { db } from "../db/database.js";

// 1. Get Products with search, filtering, and sorting
export async function getProducts(req, res) {
  try {
    const {
      q,
      category,
      brand,
      availability, // 'all', 'available', 'unavailable'
      minPrice,
      maxPrice,
      sort = "featured",
      tag,
      limit = 100,
      offset = 0,
    } = req.query;

    let sql = `
      SELECT p.*, 
             COALESCE(i.stock_quantity, 0) as stock,
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category) {
      sql += ` AND (p.category_id = ? OR c.slug = ?)`;
      params.push(category, category);
    }

    if (brand) {
      const brandsList = Array.isArray(brand) ? brand : [brand];
      const placeholders = brandsList.map(() => "?").join(",");
      sql += ` AND p.brand_name IN (${placeholders})`;
      params.push(...brandsList);
    }

    if (availability === "available") {
      sql += ` AND p.available = 1`;
    } else if (availability === "unavailable") {
      sql += ` AND p.available = 0`;
    }

    if (minPrice !== undefined && minPrice !== "") {
      sql += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      sql += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    if (tag) {
      sql += ` AND p.tag = ?`;
      params.push(tag);
    }

    if (q && q.trim()) {
      const queryTerm = `%${q.trim().toLowerCase()}%`;
      sql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.brand_name) LIKE ? OR LOWER(p.description) LIKE ?)`;
      params.push(queryTerm, queryTerm, queryTerm);
    }

    // Sorting
    switch (sort) {
      case "price-asc":
        sql += ` ORDER BY p.price ASC`;
        break;
      case "price-desc":
        sql += ` ORDER BY p.price DESC`;
        break;
      case "name":
        sql += ` ORDER BY p.name ASC`;
        break;
      default:
        sql += ` ORDER BY CASE WHEN p.tag IS NOT NULL THEN 0 ELSE 1 END, p.created_at DESC`;
        break;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const rows = await db.all(sql, params);

    // Format products to match frontend expectations
    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      brand: r.brand_name,
      category: r.category_id,
      categoryName: r.category_name,
      size: r.size,
      price: Number(r.price),
      discount: Number(r.discount || 0),
      currency: r.currency || "$",
      description: r.description,
      image: r.image,
      available: Boolean(r.available),
      stock: Number(r.stock || 0),
      tag: r.tag,
    }));

    return res.json({ products: formatted, count: formatted.length });
  } catch (err) {
    console.error("GetProducts error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

// 2. Get Single Product by ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const row = await db.get(
      `SELECT p.*, 
              COALESCE(i.stock_quantity, 0) as stock,
              c.name as category_name
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE (p.id = ? OR p.slug = ?) AND p.is_active = 1`,
      [id, id]
    );

    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }

    const images = await db.all(
      `SELECT image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY display_order ASC`,
      [row.id]
    );

    const product = {
      id: row.id,
      name: row.name,
      brand: row.brand_name,
      category: row.category_id,
      categoryName: row.category_name,
      size: row.size,
      price: Number(row.price),
      discount: Number(row.discount || 0),
      currency: row.currency || "$",
      description: row.description,
      image: row.image,
      images: images.length ? images.map((img) => img.image_url) : [row.image],
      available: Boolean(row.available),
      stock: Number(row.stock || 0),
      tag: row.tag,
    };

    return res.json(product);
  } catch (err) {
    console.error("GetProductById error:", err);
    return res.status(500).json({ error: "Failed to fetch product details" });
  }
}

// 3. Admin: Create Product
export async function createProduct(req, res) {
  try {
    const {
      name,
      brand,
      category,
      size,
      price,
      stock = 24,
      available = true,
      image,
      description,
      tag,
      currency = "$",
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: "Name, category, and price are required." });
    }

    const productId = `p-${Date.now()}`;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const brandName = brand?.trim() || "AYLA Essentials";

    // Ensure brand exists
    let brandRow = await db.get(`SELECT id FROM brands WHERE name = ?`, [brandName]);
    let brandId = brandRow ? brandRow.id : null;
    if (!brandRow) {
      brandId = `b-${Date.now()}`;
      await db.run(`INSERT INTO brands (id, name) VALUES (?, ?)`, [brandId, brandName]);
    }

    const defaultImage =
      image || `https://loremflickr.com/700/700/luxury,amenities?lock=${Math.floor(Math.random() * 900) + 100}`;

    await db.run(
      `INSERT INTO products 
       (id, slug, name, brand_id, brand_name, category_id, size, price, currency, description, image, available, is_active, tag)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        productId,
        slug,
        name.trim(),
        brandId,
        brandName,
        category,
        size || "1 unit",
        parseFloat(price),
        currency,
        description || "",
        defaultImage,
        available ? 1 : 0,
        tag || null,
      ]
    );

    // Insert primary image
    await db.run(
      `INSERT INTO product_images (id, product_id, image_url, is_primary, display_order)
       VALUES (?, ?, ?, 1, 1)`,
      [`img-${Date.now()}`, productId, defaultImage]
    );

    // Insert Inventory
    await db.run(
      `INSERT INTO inventory (id, product_id, stock_quantity, low_stock_threshold)
       VALUES (?, ?, ?, 5)`,
      [`inv-${Date.now()}`, productId, parseInt(stock, 10) || 0]
    );

    const created = await db.get(
      `SELECT p.*, COALESCE(i.stock_quantity, 0) as stock
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.id = ?`,
      [productId]
    );

    return res.status(201).json({
      message: "Product created successfully",
      product: {
        ...created,
        brand: created.brand_name,
        category: created.category_id,
        available: Boolean(created.available),
      },
    });
  } catch (err) {
    console.error("CreateProduct error:", err);
    return res.status(500).json({ error: "Failed to create product" });
  }
}

// 4. Admin: Update Product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      category,
      size,
      price,
      stock,
      available,
      image,
      description,
      tag,
      currency,
    } = req.body;

    const existing = await db.get(`SELECT * FROM products WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    let brandId = existing.brand_id;
    let brandName = brand !== undefined ? brand.trim() : existing.brand_name;
    if (brand && brand.trim() !== existing.brand_name) {
      let bRow = await db.get(`SELECT id FROM brands WHERE name = ?`, [brandName]);
      if (!bRow) {
        brandId = `b-${Date.now()}`;
        await db.run(`INSERT INTO brands (id, name) VALUES (?, ?)`, [brandId, brandName]);
      } else {
        brandId = bRow.id;
      }
    }

    await db.run(
      `UPDATE products 
       SET name = COALESCE(?, name),
           brand_id = ?,
           brand_name = ?,
           category_id = COALESCE(?, category_id),
           size = COALESCE(?, size),
           price = COALESCE(?, price),
           currency = COALESCE(?, currency),
           description = COALESCE(?, description),
           image = COALESCE(?, image),
           available = COALESCE(?, available),
           tag = COALESCE(?, tag),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name,
        brandId,
        brandName,
        category,
        size,
        price !== undefined ? parseFloat(price) : null,
        currency,
        description,
        image,
        available !== undefined ? (available ? 1 : 0) : null,
        tag,
        id,
      ]
    );

    if (stock !== undefined) {
      await db.run(
        `INSERT INTO inventory (id, product_id, stock_quantity)
         VALUES (?, ?, ?)
         ON CONFLICT(product_id) DO UPDATE SET stock_quantity = excluded.stock_quantity, updated_at = CURRENT_TIMESTAMP`,
        [`inv-${Date.now()}`, id, parseInt(stock, 10) || 0]
      );
    }

    if (image) {
      await db.run(
        `UPDATE product_images SET image_url = ? WHERE product_id = ? AND is_primary = 1`,
        [image, id]
      );
    }

    const updated = await db.get(
      `SELECT p.*, COALESCE(i.stock_quantity, 0) as stock
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.id = ?`,
      [id]
    );

    return res.json({
      message: "Product updated successfully",
      product: {
        ...updated,
        brand: updated.brand_name,
        category: updated.category_id,
        available: Boolean(updated.available),
      },
    });
  } catch (err) {
    console.error("UpdateProduct error:", err);
    return res.status(500).json({ error: "Failed to update product" });
  }
}

// 5. Admin: Delete Product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await db.run(`DELETE FROM products WHERE id = ?`, [id]);
    return res.json({ message: "Product removed from catalog" });
  } catch (err) {
    console.error("DeleteProduct error:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
}
