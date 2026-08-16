import { Router } from "express";
import {
  getWishlist,
  toggleWishlist,
  removeItem,
} from "../controllers/wishlistController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.use(optionalAuth);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.delete("/:productId", removeItem);

export default router;
