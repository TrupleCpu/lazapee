import {
  AlertCircle,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { productsApi } from "../lib/endpoints";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types";
import { formatCurrency } from "../lib/format";
import { getProductImage } from "../lib/images";
import Breadcrumb from "../components/ui/Breadcrumb";
import QuantityStepper from "../components/store/QuantityStepper";
import ProductCard from "../components/store/ProductCard";
import { ProductCardSkeleton } from "../components/ui";
import Skeleton from "react-loading-skeleton";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data, loading } = useFetch(
    async () => {
      if (!id) return [];
      return productsApi.get(id);
    },
    { immediate: Boolean(id) },
  );

  const { data: allProducts } = useFetch(productsApi.list);

  const product: Product | null =
    data && Array.isArray(data) ? data[0] ?? null : data ?? null;

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="container mx-auto max-w-7xl py-20">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <Skeleton width={40} height={16} />
            <span>&gt;</span>
            <Skeleton width={60} height={16} />
            <span>&gt;</span>
            <Skeleton width={90} height={16} />
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative w-full h-100 sm:h-120 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md">
              <Skeleton height={480} borderRadius={16} className="w-full" />
            </div>

            <div className="space-y-6">
              <Skeleton width="70%" height={36} />
              <div className="space-y-2">
                <Skeleton width={120} height={28} />
                <Skeleton width={160} height={14} />
              </div>

              <div className="border-t border-b border-gray-200/80 py-4 space-y-3">
                <Skeleton width={110} height={12} />
                <Skeleton count={4} height={14} containerClassName="space-y-2" />
              </div>

              <Skeleton width={70} height={14} />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton width={140} height={48} borderRadius={12} />
                <Skeleton className="flex-1" height={48} borderRadius={12} />
              </div>
              <Skeleton height={48} borderRadius={12} />

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Skeleton height={64} borderRadius={12} />
                <Skeleton height={64} borderRadius={12} />
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <Skeleton width={200} height={28} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || product.stock_status === "inactive") {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Item Not Found</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              This product is currently inactive or is no longer available in
              our store catalog.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="inline-block w-full py-2.5 px-4 bg-primary hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isSameCategory = (candidate: Product) =>
    Boolean(
      product.categories?.title &&
        candidate.categories?.title === product.categories?.title,
    );

  const related = (Array.isArray(allProducts) ? allProducts : [])
    .filter((p) => p.id !== product.id)
    .filter(
      (p) =>
        p.stock_status !== "inactive" && p.stock_status !== "out_of_stock",
    )
    .sort((a, b) => Number(isSameCategory(b)) - Number(isSameCategory(a)))
    .slice(0, 4);

  const isOutOfStock =
    product.stock_status === "out_of_stock" || (product.quantity ?? 0) <= 0;
  const maxQuantity = Math.max(product.quantity ?? 1, 1);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto max-w-7xl py-20">
        <Breadcrumb
          items={[
            { label: "Products", to: "/products" },
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="relative w-full h-100 sm:h-120 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {product.badge}
                </span>
              )}
              <img
                src={getProductImage(product)}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>

              {isOutOfStock ? (
                <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span>OUT OF STOCK</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>IN STOCK - READY TO SHIP ({maxQuantity} left)</span>
                </div>
              )}
            </div>

            <div className="border-t border-b border-gray-200/80 py-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                DESCRIPTION
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <p className="text-xs font-semibold text-gray-500">Quantity</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <QuantityStepper
                  quantity={isOutOfStock ? 0 : quantity}
                  min={1}
                  max={maxQuantity}
                  disabled={isOutOfStock}
                  onDecrement={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  onIncrement={() =>
                    setQuantity((prev) => Math.min(prev + 1, maxQuantity))
                  }
                />

                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className={`flex-1 font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-150 shadow-md cursor-pointer disabled:cursor-not-allowed ${
                    !isOutOfStock
                      ? "bg-accent hover:bg-accent-hover text-white active:scale-[0.98]"
                      : "bg-gray-300 text-gray-500 shadow-none"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}</span>
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  onClick={handleAddToCart}
                  className={`w-full font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors ${
                    !isOutOfStock
                      ? "bg-white border border-primary text-primary hover:bg-blue-50 cursor-pointer"
                      : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  BUY NOW
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3 p-3.5 bg-blue-50/60 rounded-xl text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold">3yr Warranty</span>
              </div>
              <div className="flex items-center space-x-3 p-3.5 bg-blue-50/60 rounded-xl text-blue-900">
                <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold">Free Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;