import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../../hooks/useCart";
import { getProductImage } from "../../lib/images";
import { formatPriceShort } from "../../lib/format";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  imageHeight?: string;
  compact?: boolean;
}

const ProductCard = ({ product, imageHeight = "h-48", compact = false }: ProductCardProps) => {
  const { addToCart } = useCart();
  const isInStock =
    product.stock_status === "in_stock" || (product.quantity ?? 0) > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200 group">
      <div className={`relative ${imageHeight} w-full bg-gray-100 overflow-hidden`}>
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {product.badge ? (
            <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          ) : (
            <div />
          )}
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm ${
              isInStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {product.images?.[0] ? (
          <img
            src={getProductImage(product)}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
            No image
          </div>
        )}
      </div>

      <div className={compact ? "p-4 flex-1 flex flex-col justify-between" : "p-5 flex-1 flex flex-col justify-between"}>
        <div>
          {product.categories?.title && (
            <p className="text-xs font-semibold text-gray-400">
              {product.categories.title}
            </p>
          )}
          <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
            {product.title}
          </h3>
          <p className="text-xl font-bold text-primary mt-2 flex justify-between items-center">
            {formatPriceShort(product.price)}
            {!compact && (
              <span className="text-xs text-gray-500 font-normal">
                Qty: {product.quantity}
              </span>
            )}
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <Link
            to={`/products/${product.id}`}
            className="block w-full py-2 px-4 bg-white border border-primary text-primary hover:bg-blue-50 font-semibold rounded-lg text-sm text-center transition-colors duration-150"
          >
            View Details
          </Link>
          <button
            onClick={() => isInStock && addToCart(product)}
            disabled={!isInStock}
            className={`w-full py-2 px-4 font-semibold rounded-lg text-sm transition-colors duration-150 shadow-sm ${
              isInStock
                ? "bg-accent hover:bg-accent-hover text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isInStock ? (
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </span>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;