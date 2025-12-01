"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";

type CartItemType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function PanierPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      if (data.items && Array.isArray(data.items)) {
        setCartItems(
          data.items.map((item: any) => ({
            id: item.itemId,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            image: item.image || undefined,
          }))
        );
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Erreur récupération panier:", err);
      setError("Impossible de récupérer le panier.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId: number, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/update/${itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    } catch {
      fetchCart();
    }
  };

  const removeItem = async (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/remove/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      fetchCart();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-10 pb-20 flex flex-col lg:flex-row gap-24">
      <div className="flex-1">
        {loading ? (
          <p>Chargement du panier...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <CartItemsList
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        )}
      </div>

      <CartSummary cartItems={cartItems} />
    </div>
  );
}
