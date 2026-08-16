import { requireAuth } from "./auth.js";

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Administrator privileges required." });
    }
    next();
  });
}
