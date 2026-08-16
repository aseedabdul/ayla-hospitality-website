import { Router } from "express";
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  applyDiscount,
} from "../controllers/cartController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.use(optionalAuth);

router.get("/", getCart);
router.post("/items", addItem);
router.put("/items", updateQuantity);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);
router.post("/discount", applyDiscount);

export default router;
