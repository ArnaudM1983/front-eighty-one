"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ButtonLink from "../ui/ButtonLink";

type CartItemType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
};

type Props = {
  cartItems: CartItemType[];
  cartToken: string;
};

export default function CartSummary({ cartItems, cartToken }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const outOfStockItems = cartItems.filter(
    (item) => typeof item.stock === "number" && (item.stock === 0 || item.quantity > item.stock)
  );
  const hasStockIssues = outOfStockItems.length > 0;

  const handleCreateOrder = async () => {
    if (hasStockIssues) {
      return;
    }

    if (!cartToken) {
      setError("Cart token manquant");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PROXY_URL}/api/order/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cartToken }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/paiement/${data.orderId}`);
      } else {
        setError(data.message || data.error || "Impossible de créer la commande");
      }
    } catch {
      setError("Erreur serveur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/3 rounded-md h-screen flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>

      <div className="flex justify-between text-black font-medium">
        <span>Sous-total :</span>
        <span>{subtotal.toFixed(2)} €</span>
      </div>

      <p className="text-sm font-light max-w-56">
        Les frais de livraison seront calculés lors de la commande.
      </p>

      <div className="py-3 flex justify-between text-black font-bold text-lg border-t border-b border-gray-200">
        <span>Total :</span>
        <span>{subtotal.toFixed(2)} €</span>
      </div>

      {hasStockIssues && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs flex flex-col gap-1 mt-2">
          <p className="font-semibold flex items-center gap-1.5">
            <span>⚠️</span> Articles indisponibles
          </p>
          <p className="text-[11px] leading-relaxed">
            Certains produits de votre panier ne sont plus en stock suffisant. Veuillez les retirer ou ajuster vos quantités pour pouvoir commander.
          </p>
        </div>
      )}

      <ButtonLink
        onClick={handleCreateOrder}
        disabled={loading || hasStockIssues || cartItems.length === 0}
        className="w-full text-center mt-4"
      >
        {loading ? "Création de la commande..." : hasStockIssues ? "Articles indisponibles" : "Commander"}
      </ButtonLink>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
