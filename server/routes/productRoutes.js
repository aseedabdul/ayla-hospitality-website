import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-protected routes
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
