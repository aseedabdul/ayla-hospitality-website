# AYLA Hospitality — Full-Stack Application

A luxury hospitality amenities and in-room ordering platform with a React 19 frontend, Express REST API backend, and relational database schema supporting PostgreSQL / Supabase and local relational SQLite.

## Architecture

```
Frontend (React 19 + Vite)
      ↓ (/api proxy or direct REST)
Backend API (Express REST API Server on :5000)
      ↓ (pg / Supabase / SQLite)
Relational Database (12 Normalized Entities with RLS)
```

## Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Tailwind CSS v4, Framer Motion, GSAP, Lenis (smooth scroll), Lucide React.
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), Bcrypt, Multer (image uploads), CORS, Dotenv.
- **Database**: Relational Database with 12 normalized tables (`users`, `user_profiles`, `admin_users`, `categories`, `brands`, `products`, `product_images`, `inventory`, `carts`, `cart_items`, `wishlists`, `wishlist_items`). Fully compatible with **PostgreSQL / Supabase** and zero-config local relational SQLite.
- **Design System**: Ivory/Beige (`#F8F4EC`), Deep Ink (`#1A1712`), Gold (`#B4863F`, `#8C6528`, `#D9BC88`), Cormorant Garamond + Manrope typography.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
- `PORT`: Backend server port (default: `5000`)
- `JWT_SECRET`: Secret key for signing authentication tokens
- `DATABASE_URL`: (Optional) PostgreSQL / Supabase connection string. If omitted, uses local zero-config relational SQLite (`server/data/ayla.db`).
- `UPLOAD_DIR`: Directory for image uploads (`uploads/`)

### 3. Seed Database
```bash
npm run seed
```
This populates:
- 5 Luxury Categories (Travel Kit, Groceries, Medicines, Cosmetics, Fast Food)
- 10 Brands
- 16 Products with inventory stock & images
- Default Seed Users:
  - **Guest User**: `camille.fontaine@example.com` / `guestpassword123`
  - **Admin User**: `admin@aylahospitality.com` / `adminpassword123`

### 4. Run Application (Frontend + Backend Concurrently)
```bash
npm run dev:all
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/api/health

Alternatively, run them separately:
```bash
# Terminal 1: Start Backend API
npm run server

# Terminal 2: Start Frontend
npm run dev
```

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Customer registration (creates user & profile, returns JWT)
- `POST /api/auth/login` — Customer login (verifies bcrypt hash, returns JWT)
- `POST /api/auth/admin/login` — Staff/Admin login with role authorization
- `GET /api/auth/profile` — Get authenticated user profile (`Bearer <token>`)
- `PUT /api/auth/profile` — Update user profile details

### Catalog & Products (`/api/products`)
- `GET /api/products` — Filter products by `q` (search), `category`, `brand`, `availability`, `minPrice`, `maxPrice`, `sort`
- `GET /api/products/:id` — Get product by ID with category, brand, images, inventory stock
- `POST /api/products` — Create product (Admin only)
- `PUT /api/products/:id` — Update product price, stock, details (Admin only)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Categories & Brands (`/api/categories`, `/api/brands`)
- `GET /api/categories` — Get all categories with product counts
- `GET /api/categories/:id` — Get category details
- `POST /api/categories` — Create category (Admin only)
- `PUT /api/categories/:id` — Update category (Admin only)
- `DELETE /api/categories/:id` — Delete category (Admin only)
- `GET /api/brands` — Get unique brands list

### Cart (`/api/cart`)
- `GET /api/cart` — Get cart with server-side computed subtotals, promo discount, delivery fee, total
- `POST /api/cart/items` — Add product to cart with stock validation
- `PUT /api/cart/items` — Update item quantity with stock validation
- `DELETE /api/cart/items/:productId` — Remove item from cart
- `DELETE /api/cart` — Empty cart
- `POST /api/cart/discount` — Apply promo code (`AYLA-WELCOME`, `AYLA-NIGHT10`, `AYLA-WELL15`)

### Wishlist (`/api/wishlist`)
- `GET /api/wishlist` — Get saved items for user/session
- `POST /api/wishlist/toggle` — Toggle item in wishlist
- `DELETE /api/wishlist/:productId` — Remove item from wishlist

### Admin & Media (`/api/admin`, `/api/upload`)
- `GET /api/admin/stats` — Admin dashboard metrics & low stock alerts
- `POST /api/upload` — Upload product or category images (Admin only)

---

## Supabase Deployment

For direct Supabase PostgreSQL deployment:
1. Run the DDL script in `supabase_schema.sql` inside the **Supabase SQL Editor**.
2. Set your Supabase connection string in `.env`:
   ```env
   DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
3. Run `npm run seed` to seed your Supabase database.
