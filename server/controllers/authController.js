import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { db } from "../db/database.js";

// Helper: Sign JWT
function signToken(userId, role) {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

// 1. Customer Registration
export async function register(req, res) {
  try {
    const { email, password, name, phone, hotel, room } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existing = await db.get(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ error: "An account with this email address already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `u-${Date.now()}`;
    const profileId = `prof-${Date.now()}`;

    await db.run(
      `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, 'customer')`,
      [userId, email.toLowerCase().trim(), passwordHash]
    );

    await db.run(
      `INSERT INTO user_profiles (id, user_id, name, phone, hotel, room, tier, member_since)
       VALUES (?, ?, ?, ?, ?, ?, 'Silver Guest', ?)`,
      [
        profileId,
        userId,
        name.trim(),
        phone || "",
        hotel || "The Meridian Hotel",
        room || "412",
        new Date().getFullYear().toString(),
      ]
    );

    const token = signToken(userId, "customer");
    const profile = await db.get(`SELECT * FROM user_profiles WHERE user_id = ?`, [userId]);

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: userId, email: email.toLowerCase().trim(), role: "customer" },
      profile,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Failed to register account" });
  }
}

// 2. Customer Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user.id, user.role);
    const profile = await db.get(`SELECT * FROM user_profiles WHERE user_id = ?`, [user.id]);

    return res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, email: user.email, role: user.role },
      profile,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

// 3. Admin / Staff Login
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Staff email and password are required." });
    }

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: "Invalid staff credentials." });
    }

    if (user.role !== "admin" && user.role !== "staff") {
      return res.status(403).json({ error: "Access denied. Administrator privileges required." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid staff credentials." });
    }

    const token = signToken(user.id, user.role);
    const profile = await db.get(`SELECT * FROM user_profiles WHERE user_id = ?`, [user.id]);

    return res.json({
      message: "Admin authentication successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
      profile,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Admin authentication failed" });
  }
}

// 4. Get Current User Profile
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const profile = await db.get(`SELECT * FROM user_profiles WHERE user_id = ?`, [userId]);
    const user = await db.get(`SELECT id, email, role FROM users WHERE id = ?`, [userId]);

    return res.json({ user, profile });
  } catch (err) {
    console.error("GetProfile error:", err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
}

// 5. Update Profile
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, phone, hotel, room } = req.body;

    await db.run(
      `UPDATE user_profiles 
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           hotel = COALESCE(?, hotel),
           room = COALESCE(?, room),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [name, phone, hotel, room, userId]
    );

    const profile = await db.get(`SELECT * FROM user_profiles WHERE user_id = ?`, [userId]);
    return res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    console.error("UpdateProfile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}
