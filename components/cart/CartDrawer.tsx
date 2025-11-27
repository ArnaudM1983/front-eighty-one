"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import ButtonLink from "../ui/ButtonLink";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  close: () => void;
};

export default function CartDrawer({ isOpen, close }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = itemCount > 0;

  // Fonction pour récupérer le panier
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Cookies actuels :", document.cookie);


      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Réponse API fetchCart :", res);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("Données reçues du panier :", data);

      if (data.items && Array.isArray(data.items)) {
        setCartItems(
          data.items.map((item: any) => ({
            id: item.productId,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
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

  // Refresh panier quand le drawer s'ouvre
  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen, fetchCart]);

  // Mettre à jour la quantité d'un item
  const updateQuantity = async (itemId: number, newQty: number) => {
    console.log(`Update quantité item ${itemId} → ${newQty}`);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/${itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchCart();
    } catch (err) {
      console.error("Erreur mise à jour quantité:", err);
    }
  };

  // Supprimer un item du panier
  const removeItem = async (itemId: number) => {
    console.log(`Suppression item ${itemId}`);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchCart();
    } catch (err) {
      console.error("Erreur suppression item:", err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={close}
      />


      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full md:w-96 h-screen bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-700 cursor-pointer transform transition-transform duration-300 hover:rotate-90"
          onClick={close}
        >
          <X className="w-6 h-6" strokeWidth={1} />
        </button>

        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <p className="font-regular text-lg">Panier d'achat</p>
            {hasItems && (
              <span className="inline-flex items-center justify-center bg-primary text-white text-xs font-bold w-5 h-5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Chargement du panier...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : hasItems ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          className="w-16 border rounded p-1 text-center"
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        />
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex justify-between items-center font-semibold uppercase text-lg pt-4 border-t border-gray-200">
                <p>Sous-total :</p>
                <p>
                  {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} €
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">Votre panier est vide</p>
              <ButtonLink onClick={close}>Continuer vos achats</ButtonLink>
            </div>
          )}
        </div>
      </div>
    </>


  );
}
