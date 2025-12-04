"use client";

import { X, ShoppingCart } from "lucide-react";
import ButtonLink from "../ui/ButtonLink";
import CartItem from "./CartItem";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type Props = {
  isOpen: boolean;
  close: () => void;
};

export default function CartDrawer({ isOpen, close }: Props) {
  const router = useRouter();
  const { cartItems, cartCount, error, updateQuantity, removeItem } = useCart();

  const hasItems = cartCount > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full md:w-96 h-screen bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-700 cursor-pointer"
          onClick={close}
        >
          <X className="w-6 h-6" strokeWidth={1} />
        </button>

        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <p className="font-regular text-lg text-black">Panier d'achat</p>
            {hasItems && (
              <span className="inline-flex items-center justify-center bg-primary text-white text-xs font-bold w-5 h-5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {error && <p className="text-center text-red-500">{error}</p>}

          {hasItems ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    image={
                      item.image
                        ? `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/${item.image}`
                        : undefined
                    }
                    stock={item.stock}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>

              <div className="mt-auto flex justify-between items-center uppercase pt-4 border-t border-gray-200">
                <p className="text-black">Sous-total :</p>
                <p className="text-black">
                  {cartItems
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>

              <ButtonLink
                onClick={() => {
                  close();
                  router.push("/panier");
                }}
                className="my-4 w-full text-center"
              >
                Voir le panier
              </ButtonLink>
              <ButtonLink onClick={() => {
                  close();
                  router.push("/paiement");
                }}
                className="my-4 w-full text-center">
                Commander
              </ButtonLink>
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
