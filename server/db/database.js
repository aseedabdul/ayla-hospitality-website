import Database from "better-sqlite3";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sqliteDb = null;
let pgPool = null;
let isPostgres = false;

// Initialize database
export function initDatabase() {
  if (config.databaseUrl && config.databaseUrl.startsWith("postgres")) {
    try {
      pgPool = new pg.Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes("supabase.co") || config.databaseUrl.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : false,
      });
      isPostgres = true;
      console.log("Connected to PostgreSQL/Supabase database.");
      return;
    } catch (err) {
      console.warn("Failed to connect to PostgreSQL, falling back to local SQLite:", err.message);
    }
  }

  // Local Relational SQLite fallback
  const dataDir = path.resolve(__dirname, "../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.resolve(dataDir, "ayla.db");
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma("journal_mode = WAL");
  sqliteDb.pragma("foreign_keys = ON");
  isPostgres = false;

  // Execute DDL schema
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  sqliteDb.exec(schemaSql);
  console.log(`Relational SQLite Database initialized at ${dbPath}`);
}

// Database helper methods
export const db = {
  // Query multiple rows
  all: async (sql, params = []) => {
    if (isPostgres && pgPool) {
      // Convert ? to $1, $2, etc for postgres
      let index = 1;
      const pgSql = sql.replace(/\?/g, () => `$${index++}`);
      const res = await pgPool.query(pgSql, params);
      return res.rows;
    }
    if (!sqliteDb) initDatabase();
    return sqliteDb.prepare(sql).all(...params);
  },

  // Query single row
  get: async (sql, params = []) => {
    if (isPostgres && pgPool) {
      let index = 1;
      const pgSql = sql.replace(/\?/g, () => `$${index++}`);
      const res = await pgPool.query(pgSql, params);
      return res.rows[0] || null;
    }
    if (!sqliteDb) initDatabase();
    return sqliteDb.prepare(sql).get(...params) || null;
  },

  // Execute INSERT, UPDATE, DELETE
  run: async (sql, params = []) => {
    if (isPostgres && pgPool) {
      let index = 1;
      const pgSql = sql.replace(/\?/g, () => `$${index++}`);
      const res = await pgPool.query(pgSql, params);
      return { changes: res.rowCount };
    }
    if (!sqliteDb) initDatabase();
    return sqliteDb.prepare(sql).run(...params);
  },

  // Execute raw script
  exec: async (sql) => {
    if (isPostgres && pgPool) {
      return await pgPool.query(sql);
    }
    if (!sqliteDb) initDatabase();
    return sqliteDb.exec(sql);
  },

  // Is using PostgreSQL
  isPostgres: () => isPostgres,
};

// Initialize automatically upon import
initDatabase();
