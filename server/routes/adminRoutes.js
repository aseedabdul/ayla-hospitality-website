import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.use(requireAdmin);

router.get("/stats", getDashboardStats);

export default router;
