"use client";

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
};

export default function CartSummary({ cartItems }: Props) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            <ButtonLink href="/cart-summary" className="mt-6 w-full text-center">
                Commander
            </ButtonLink>

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
