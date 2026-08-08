import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import AdminRootLayout from "../layout/AdminRootLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Categories = lazy(() => import("../pages/Categories"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const AdminCategories = lazy(() => import("../pages/admin/AdminCategories"));
const AdminCustomers = lazy(() => import("../pages/admin/AdminCustomers"));
const AdminProductsAdd = lazy(() => import("../pages/admin/AdminProductAdd"));
const AdminCategoriesAdd = lazy(
  () => import("../pages/admin/AdminCategoryAdd"),
);
const AdminOrderDetails = lazy(
  () => import("../pages/admin/AdminOrderDetails"),
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/products",
        Component: Products,
      },
      {
        path: "/categories",
        Component: Categories,
      },
      {
        path: "/products/:id",
        Component: ProductDetails,
      },
      {
        path: "/cart",
        Component: Cart,
      },
      {
        path: "/checkout",
        Component: Checkout,
      },
    ],
  },

  {
    path: "/admin",
    Component: AdminRootLayout,
    children: [
      {
        path: "login",
        Component: AdminLogin,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            Component: AdminLayout,
            children: [
              {
                path: "dashboard",
                Component: AdminDashboard,
              },
              {
                path: "products",
                Component: AdminProducts,
              },
              {
                path: "products/add",
                Component: AdminProductsAdd,
              },
              {
                path: "orders",
                Component: AdminOrders,
              },
              {
                path: "orders/details/:id",
                Component: AdminOrderDetails,
              },
              {
                path: "categories",
                Component: AdminCategories,
              },
              {
                path: "categories/add",
                Component: AdminCategoriesAdd,
              },
              {
                path: "customers",
                Component: AdminCustomers,
              },
            ],
          },
        ],
      },
    ],
  },
]);
