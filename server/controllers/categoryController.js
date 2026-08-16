import { db } from "../db/database.js";

// 1. Get all categories
export async function getCategories(req, res) {
  try {
    const rows = await db.all(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
       GROUP BY c.id
       ORDER BY c.display_order ASC, c.name ASC`
    );

    const categories = rows.map((r) => ({
      id: r.id,
      name: r.name,
      tagline: r.tagline,
      description: r.description,
      image: r.image,
      productCount: Number(r.product_count || 0),
    }));

    return res.json({ categories });
  } catch (err) {
    console.error("GetCategories error:", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

// 2. Get category by ID / slug
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await db.get(
      `SELECT * FROM categories WHERE id = ? OR slug = ?`,
      [id, id]
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json(category);
  } catch (err) {
    console.error("GetCategoryById error:", err);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
}

// 3. Admin: Create Category
export async function createCategory(req, res) {
  try {
    const { name, tagline, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const id = slug;
    const defaultImage =
      image || `https://loremflickr.com/900/1100/${encodeURIComponent(name)}?lock=${Math.floor(Math.random() * 900) + 100}`;

    await db.run(
      `INSERT INTO categories (id, slug, name, tagline, description, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, slug, name.trim(), tagline || "", description || "", defaultImage]
    );

    const created = await db.get(`SELECT * FROM categories WHERE id = ?`, [id]);
    return res.status(201).json({ message: "Category created", category: created });
  } catch (err) {
    console.error("CreateCategory error:", err);
    return res.status(500).json({ error: "Failed to create category" });
  }
}

// 4. Admin: Update Category
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, tagline, description, image } = req.body;

    await db.run(
      `UPDATE categories
       SET name = COALESCE(?, name),
           tagline = COALESCE(?, tagline),
           description = COALESCE(?, description),
           image = COALESCE(?, image),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, tagline, description, image, id]
    );

    const updated = await db.get(`SELECT * FROM categories WHERE id = ?`, [id]);
    return res.json({ message: "Category updated", category: updated });
  } catch (err) {
    console.error("UpdateCategory error:", err);
    return res.status(500).json({ error: "Failed to update category" });
  }
}

// 5. Admin: Delete Category
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await db.run(`DELETE FROM categories WHERE id = ?`, [id]);
    return res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("DeleteCategory error:", err);
    return res.status(500).json({ error: "Failed to delete category" });
  }
}
