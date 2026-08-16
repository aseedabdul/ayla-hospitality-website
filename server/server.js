import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config/index.js";
import "./db/database.js"; // Initialize database

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost origin in development or match configured origin
      if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static upload directory
const uploadPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadPath));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "AYLA Hospitality API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: config.nodeEnv === "development" ? err.message : undefined,
  });
});

// Start listening
const server = app.listen(config.port, () => {
  console.log(`==================================================`);
  console.log(`  AYLA HOSPITALITY BACKEND SERVER ACTIVE`);
  console.log(`  API URL: http://localhost:${config.port}/api`);
  console.log(`  Health:  http://localhost:${config.port}/api/health`);
  console.log(`==================================================`);
});

export default app;
