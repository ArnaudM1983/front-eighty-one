"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CartContextType = {
  cartCount: number;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart`, {
        credentials: "include",
      });
      const data = await res.json();
      setCartCount(data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0);
    } catch (err) {
      console.error("Erreur récupération panier:", err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
