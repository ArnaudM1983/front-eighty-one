"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonLink from "../ui/ButtonLink";
import Image from "next/image";

type CartItemType = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

type Props = {
    cartItems: CartItemType[];
    cartToken: string; // Token du panier à envoyer à l'API
};

export default function CartSummary({ cartItems, cartToken }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCreateOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ cartToken }),
                }
            );

            const data = await res.json();

            if (res.ok && data.success) {
                // Redirection vers la page checkout avec l'ID de la commande
                router.push(`/paiement/${data.orderId}`);
            } else {
                setError(data.error || "Impossible de créer la commande");
            }
        } catch (err) {
            console.error(err);
            setError("Erreur serveur lors de la création de la commande");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:w-1/3 rounded-md h-fit flex flex-col gap-4">
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

            {/* Bouton Commander */}
            <button
                onClick={handleCreateOrder}
                disabled={loading || cartItems.length === 0}
                className="mt-6 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md disabled:opacity-50"
            >
                {loading ? "Création de la commande..." : "Commander"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Boutons paiement direct avec images */}
            <a
                href="/checkout/apple-pay"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 rounded-4xl"
            >
                <span className="flex items-center gap-2 text-white">
                    Payer avec
                    <Image src="/apple-pay.png" alt="Apple Pay" width={42} height={42} />
                </span>
            </a>

            <a
                href="/checkout/google-pay"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 rounded-4xl"
            >
                <span className="flex items-center gap-2 text-white">
                    Payer avec
                    <Image src="/google-pay.png" alt="Google Pay" width={42} height={42} />
                </span>
            </a>
        </div>
    );
}
