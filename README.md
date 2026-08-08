# Lazapee — Full-Stack E-Commerce

Lazapee is a responsive full-stack e-commerce platform built for the **CubeTech Web Development Intern Assessment**. It consists of a **Customer Website** (storefront) and an **Admin Dashboard** (management), powered by a shared REST API with a Supabase (PostgreSQL) database and Appwrite image storage.

> **Ready to run it?** Jump to the setup guides below — they tell you exactly which folder to navigate into.

---

## 🔗 Live Links

| Link | URL |
| --- | --- |
| GitHub Repository | `https://github.com/TrupleCpu/Lazapee` |
| Customer Website | [Add live URL] |
| Admin Dashboard | [Add live URL] |

## 🔑 Admin Credentials

| Email | Password |
| --- | --- |
| `admin@lazapee.com` | `admin123` |

Admin login page: `/admin/login` (e.g. `http://localhost:5173/admin/login` locally).

---

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 8, Recharts, react-loading-skeleton, lucide-react |
| Backend | Node.js, Express 5, Supabase (Postgres + auth), Appwrite Storage, JWT (httpOnly cookie), Multer, Zod, bcryptjs |
| Deployment | Vercel (serverless, single project) |

---

## 📁 Repository Navigation

Everything you need lives under these folders — open the relevant one before running setup:

```
lazapee/
├── frontend/                → Customer website + admin dashboard (React)
│   ├── README.md            → FRONTEND SETUP INSTRUCTIONS
│   └── src/                 → React source code
├── backend/                 → Express REST API
│   ├── README.md            → BACKEND SETUP INSTRUCTIONS
│   ├── .env.example         → Copy this to create your own .env
│   └── supabase/schema.sql  → Database schema (run in Supabase)
├── api/index.ts             → Vercel serverless entry point
├── vercel.json              → Vercel deployment config
└── screenshots/             → Screenshots (desktop/ and mobile/)
```

---

## 🚀 Getting Started — Where to go next

Lazapee is split into **two packages**. Each has its own dedicated setup guide, so follow these
two in order:

| Step | What to do | Guide |
| --- | --- | --- |
| **1. Backend** | Open the `backend/` folder and follow its README (install deps, configure `.env`, run the DB schema, seed data, start the API on port 3000) | **[`backend/README.md`](backend/README.md)** |
| **2. Frontend** | Open the `frontend/` folder and follow its README (install deps, start the dev server on port 5173) | **[`frontend/README.md`](frontend/README.md)** |

After both are running:

- Customer site → `http://localhost:5173/`
- Admin dashboard → `http://localhost:5173/admin/login` (use the credentials above)

---

## 📖 System Flow

1. **Customer browsing** — The storefront (Home, Products, Product Details) reads products and
   categories from the shared REST API and renders them from `frontend/src`.
2. **Cart** — Customers add items to the cart; the cart persists in `localStorage` across page
   refreshes.
3. **Checkout** — The checkout form collects name, email, contact number, address, payment method
   (COD / E-Wallet / Bank Transfer) and optional notes. On submit, the backend generates an order
   number (`ORD-...`), stores the order + order items, and decrements product inventory.
4. **Order confirmation** — The customer sees a confirmation message, their generated order number,
   and an order summary.
5. **Admin** — The administrator logs in at `/admin/login` (JWT stored in an httpOnly cookie).
6. **Admin management** — The dashboard shows sales stats and charts; admins manage products,
   categories, orders (and update status), and customers.
7. **Single source of truth** — Because the storefront and the admin dashboard consume the same
   REST API, any change made by an admin (new product, price update, inactive product, order status
   change) is reflected on the customer pages immediately. Product images are uploaded to Appwrite.

---

## 📸 Screenshots

### Customer Website

| Landing | Products | Product Details | Cart |
| --- | --- | --- | --- |
| ![Landing](screenshots/desktop/landing-page.png) | ![Products](screenshots/desktop/product-page.png) | ![Product Details](screenshots/desktop/product-details-page.png) | ![Cart](screenshots/desktop/cart-page.png) |

| Categories | Checkout | Order Summary |
| --- | --- | --- |
| ![Categories](screenshots/desktop/categories-page.png) | ![Checkout](screenshots/desktop/checkout-page.png) | ![Order Summary](screenshots/desktop/order-summary-page.png) |

**Mobile**

| Landing | Products | Product Details |
| --- | --- | --- |
| ![Landing Mobile](screenshots/mobile/landing-mobile.png) | ![Products Mobile](screenshots/mobile/products-mobile.png) | ![Product Details Mobile](screenshots/mobile/product-detail-mobile.png) |

| Categories |
| --- |
| ![Categories Mobile](screenshots/mobile/categories-mobile.png) |

### Admin Dashboard

| Login | Dashboard | Products | Product Add |
| --- | --- | --- | --- |
| ![Admin Login](screenshots/desktop/admin-login-page.png) | ![Admin Dashboard](screenshots/desktop/admin-dashboard-page.png) | ![Admin Products](screenshots/desktop/admin-product-page.png) | ![Admin Product Add](screenshots/desktop/admin-product-add-page.png) |

| Categories | Category Add | Customers |
| --- | --- | --- |
| ![Admin Categories](screenshots/desktop/admin-categories-page.png) | ![Categories Add](screenshots/desktop/admin-categories-add.png) | ![Admin Customers](screenshots/desktop/admin-customers-page.png) |

**Mobile:**

| Login | Dashboard | Products | Products Add |
| --- | --- | --- | --- |
| ![Login Mobile](screenshots/mobile/admin-login-mobile.png) | ![Dashboard Mobile](screenshots/mobile/admin-dashboard-mobile.png) | ![Products Mobile](screenshots/mobile/admin-products-mobile.png) | ![Products Add Mobile](screenshots/mobile/admin-products-add-mobile.png) |

| Categories | Categories Add | Customers | Orders |
| --- | --- | --- | --- |
| ![Categories Mobile](screenshots/mobile/admin-categories-mobile.png) | ![Categories Add Mobile](screenshots/mobile/admin-categories-add-mobile.png) | ![Customers Mobile](screenshots/mobile/admin-customer-mobile.png) | ![Orders Mobile](screenshots/mobile/admin-orders-mobile.png) |

---

## 📄 Documentation

- **[Frontend Setup → `frontend/README.md`](frontend/README.md)** — install and run instructions, route map, and features for the customer site and admin dashboard.
- **[Backend Setup → `backend/README.md`](backend/README.md)** — API setup, environment variables, database schema, seeding, endpoint reference, and deployment.