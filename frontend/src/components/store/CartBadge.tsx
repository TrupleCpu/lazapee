import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router";
import { useCart } from "../../hooks/useCart";

const CartBadge = ({ onClick }: { onClick?: () => void }) => {
  const { totalItems } = useCart();

  return (
    <NavLink
      to="/cart"
      onClick={onClick}
      className={({ isActive }) =>
        `relative p-2 transition-colors duration-150 rounded-full hover:bg-gray-100 ${
          isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"
        }`
      }
      aria-label="Shopping Cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in duration-200">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </NavLink>
  );
};

export default CartBadge;