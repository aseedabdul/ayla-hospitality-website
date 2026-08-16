import { Router } from "express";
import { handleUpload } from "../controllers/uploadController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.post("/", requireAdmin, handleUpload);

export default router;
