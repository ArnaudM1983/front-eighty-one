"use client";

import { useEffect, useState, useCallback } from "react";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";

type CartItemType = {
id: number;
name: string;
price: number;
quantity: number;
image?: string;
};

export default function PanierPage() {
const [cartItems, setCartItems] = useState<CartItemType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const { refreshCart } = useCart();

const fetchCart = useCallback(async () => {
setError(null);
try {
const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart`, {
credentials: "include",
headers: { "Content-Type": "application/json" },
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
const items = Array.isArray(data.items)
? data.items.map((item: any) => ({
id: item.itemId,
name: item.name,
price: parseFloat(item.price),
quantity: item.quantity,
image: item.image || undefined,
}))
: [];
setCartItems(items);
refreshCart();
} catch (err) {
console.error("Erreur récupération panier:", err);
setError("Impossible de récupérer le panier.");
} finally {
setLoading(false);
}
}, [refreshCart]);

useEffect(() => {
fetchCart();
}, [fetchCart]);

// Optimistic UI: update immédiat sans loading
const updateQuantity = useCallback(async (itemId: number, newQty: number) => {
setCartItems(prev =>
prev.map(item => (item.id === itemId ? { ...item, quantity: newQty } : item))
);
try {
const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/update/${itemId}`, {
method: "PUT",
credentials: "include",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ quantity: newQty }),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
refreshCart();
} catch {
fetchCart(); // rollback si erreur serveur
}
}, [refreshCart, fetchCart]);

const removeItem = useCallback(async (itemId: number) => {
// Fade-out: on ajoute un flag pour la transition CSS
setCartItems(prev => prev.map(item =>
item.id === itemId ? { ...item, isRemoving: true } : item
));
setTimeout(async () => {
setCartItems(prev => prev.filter(item => item.id !== itemId));
try {
const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/remove/${itemId}`, {
method: "DELETE",
credentials: "include",
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
refreshCart();
} catch {
fetchCart(); // rollback
}
}, 200); // durée du fade
}, [refreshCart, fetchCart]);

return ( <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-10 pb-20 flex flex-col lg:flex-row gap-24"> <div className="flex-1 min-h-[300px]">
{loading ? ( <div className="animate-pulse space-y-4">
{[...Array(3)].map((_, i) => ( <div key={i} className="h-24 bg-gray-200 rounded" />
))} </div>
) : error ? ( <p className="text-red-500">{error}</p>
) : ( <CartItemsList
         cartItems={cartItems}
         updateQuantity={updateQuantity}
         removeItem={removeItem}
         
       />
)} </div> <CartSummary cartItems={cartItems} /> </div>
);
}
