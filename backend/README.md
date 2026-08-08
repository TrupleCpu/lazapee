# Lazapee — Backend

Express + TypeScript REST API for Lazapee, backed by **Supabase** (PostgreSQL) and **Appwrite**
(image storage). The frontend (customer site + admin dashboard) talks to this API.

## Prerequisites

- Node.js **20+** and npm
- A **Supabase** project (database)
- An **Appwrite** project with a storage **bucket** (product/category images)

## Setup

### 1. Install dependencies

```bash
# From the repo root, navigate into the backend folder
cd backend

# Install dependencies
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your own values. **Never** commit the real `.env`.

```bash
# From inside backend/:
copy .env.example .env        # Windows
# cp .env.example .env        # macOS / Linux
```

Required variables — see `.env.example`:

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon (public) key |
| `JWT_SECRET` | Secret used to sign the admin JWT |
| `APPWRITE_ENDPOINT` | Appwrite API endpoint (e.g. `https://cloud.appwrite.io/v1`) |
| `APPWRITE_PROJECT_ID` | Appwrite project ID |
| `APPWRITE_BUCKET_ID` | Appwrite storage bucket ID |
| `APPWRITE_API_KEY` | Appwrite API key (read/write storage) |

Optional:

| Variable | Default | Description |
| --- | --- | --- |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin (your frontend URL) |
| `PORT` | `3000` | Port the API listens on |

### 3. Create the database schema

Run the SQL file **in the Supabase dashboard** (SQL Editor):

1. Open your Supabase project → **SQL Editor** → **New query**
2. Paste the contents of [`backend/supabase/schema.sql`](supabase/schema.sql)
3. Click **Run**

This creates the `users`, `categories`, `products`, `orders`, and `order_items` tables
(the seed script expects them to exist).

### 4. Seed sample data

```bash
# From inside backend/
npx tsx src/seed-script/script.ts
```

This inserts the **admin user**, **6 categories**, and **33 sample products**.

> ⚠️ The seed is not idempotent — running it twice will fail on the duplicate admin
> user/categories. For a clean re-seed, delete the existing `users`, `categories`, products rows first.

### 5. Start the API

```bash
npm run dev
```

The API is now running at **http://localhost:3000**

Verify: open `http://localhost:3000/` → `{ "message": "Hello, TypeScript with Express!" }`

### Default admin credentials

| Email | Password |
| --- | --- |
| `admin@lazapee.com` | `admin123` |

Log in from the frontend at `/admin/login`.

## API Endpoints

All routes are under `/api`.

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | — | Admin login, sets httpOnly JWT cookie |
| GET | `/api/auth/me` | Admin | Current admin user |
| POST | `/api/auth/logout` | Admin | Clears the session cookie |
| GET | `/api/products` | — | List products (with category) |
| GET | `/api/products/:id` | — | Product detail |
| POST | `/api/products` | Admin | Create product (multipart, image upload) |
| PATCH | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/categories` | — | List categories (with product count) |
| POST | `/api/categories` | Admin | Create category (multipart, image upload) |
| PATCH | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |
| POST | `/api/orders` | — | Create order (decrements inventory) |
| GET | `/api/orders/getOrders` | Admin | List orders |
| GET | `/api/orders/:id` | Admin | Order details (by order number) |
| PATCH | `/api/orders/:id` | Admin | Update order status |
| DELETE | `/api/orders/:id` | Admin | Delete order |
| GET | `/api/customers` | Admin | Customer directory (grouped by email) |
| GET | `/api/dashboard/stats` | Admin | Dashboard metrics |
| GET | `/api/dashboard/sales` | Admin | Sales chart data |
| GET | `/api/dashboard/recent-orders` | Admin | Recent orders |
| GET | `/api/dashboard/inventory` | Admin | Low-stock alerts |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with auto-reload (nodemon) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run the compiled server from `dist/index.js` |

## Deployment

The API is designed to deploy as a **Vercel serverless function** together with the frontend:
the Express app in `src/app.ts` is exported and mounted in `api/index.ts` at the repo root,
and `vercel.json` rewrites `/api/*` to it. When deploying, set **all** of the environment
variables above in the Vercel project (never committed to git).