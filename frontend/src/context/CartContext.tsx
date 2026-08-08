import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartContextType, CartItem, Product } from "../types/cart";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "shopping_cart";

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage: ", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage: ", error);
    }
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((cart) => {
      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        const updatedCart = [...cart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        };
        return updatedCart;
      }

      return [...cart, { ...product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    if (quantity <= 0) {
      setCart((cart) => cart.filter((item) => item.id != id));
      return;
    }

    setCart((cart) =>
      cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCart((cart) => cart.filter((item) => item.id != id));
  }, []);

  const completeCheckOut = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      totalItems,
      completeCheckOut,
    }),
    [cart, addToCart, updateQuantity, removeFromCart, totalItems, completeCheckOut],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};