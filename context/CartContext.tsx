"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type CartItemType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
};

export type CartContextType = {
  cartItems: CartItemType[];
  cartCount: number;
  loading: boolean;
  error: string | null;
  cartToken: string;
  updateQuantity: (id: number, qty: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartToken, setCartToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const items = Array.isArray(data.items)
        ? data.items.map((i: any) => ({
            id: i.itemId,
            name: i.name,
            price: parseFloat(i.price),
            quantity: i.quantity,
            image: i.image,
            stock: i.stock,
          }))
        : [];

      setCartItems(items);
      setCartToken(data.cartToken || "");
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer le panier.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (id: number, qty: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: qty }),
      });
      const data = await res.json();
      if (data.availableStock !== undefined && qty > data.availableStock) {
        setCartItems(prev =>
          prev.map(i => i.id === id ? { ...i, quantity: data.availableStock } : i)
        );
        setError(`Stock disponible : ${data.availableStock}`);
      }
      if (!res.ok && data.availableStock === undefined) {
        fetchCart();
      }
    } catch {
      fetchCart();
    }
  };

  const removeItem = async (id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        error,
        cartToken,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
