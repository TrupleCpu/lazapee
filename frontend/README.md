# Lazapee — Frontend

React + TypeScript + Vite frontend for the Lazapee e-commerce storefront and admin dashboard.
This app consumes the Lazapee REST API; make sure the **backend is set up first**.

## Prerequisites

- Node.js **20+** and npm
- The Lazapee backend running (see [`backend/README.md`](../backend/README.md))

## Setup

```bash
# 1. Navigate into the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. (Optional) Configure the API base URL
#    Create a `.env` file in `frontend/` with:
#    VITE_API_URL=/api
#
#    Leave it unset (or as "/api") for local development — the Vite dev server
#    proxies /api to http://localhost:3000 automatically.

# 4. Start the dev server
npm run dev
```

The site is now available at **http://localhost:5173/**

In development, all `/api` calls are proxied to the backend at **http://localhost:3000**
(defined in [`vite.config.ts`](vite.config.ts)). In production, `/api` is served by the same
deployment (Vercel).

## Routes

| Route | Page |
| --- | --- |
| `/` | Home (hero, categories, featured products) |
| `/products` | Product listing (search, filters, sorting) |
| `/products/:id` | Product details + related products |
| `/categories` | Category listing |
| `/cart` | Shopping cart (persists in `localStorage`) |
| `/checkout` | Checkout form + order confirmation |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard (stats + charts) |
| `/admin/products` | Admin product management |
| `/admin/products/add` | Add product |
| `/admin/orders` | Admin order management |
| `/admin/orders/details/:id` | Order details |
| `/admin/categories` | Admin category management |
| `/admin/categories/add` | Add category |
| `/admin/customers` | Customer management |

## Features

**Customer**
- Home page with hero, categories, and featured products
- Responsive product grid with search, category filter, price sort, and pagination
- Product details with quantity selector, stock status, and related products
- Cart with quantity updates and totals, persisted across page refreshes
- Checkout with COD / E-Wallet / Bank Transfer and order confirmation + order number
- Skeleton loading screens

**Admin**
- JWT cookie-authenticated login
- Dashboard with 6 summary cards and a sales bar chart
- Product, category, and order management with add/edit/delete + confirmation dialogs
- Image upload (stored via Appwrite through the backend)
- Order status updates, order details, and customer directory

## Screenshots

See the parent [`README.md`](../README.md) for the full screenshot gallery.