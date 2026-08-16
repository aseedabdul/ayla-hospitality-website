import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", requireAdmin, createCategory);
router.put("/:id", requireAdmin, updateCategory);
router.delete("/:id", requireAdmin, deleteCategory);

export default router;
