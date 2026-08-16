import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { db } from "../db/database.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await db.get(
      `SELECT id, email, role FROM users WHERE id = ?`,
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ error: "User not found or session expired" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await db.get(
        `SELECT id, email, role FROM users WHERE id = ?`,
        [decoded.userId]
      );
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
}
