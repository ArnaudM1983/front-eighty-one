"use client";
import { X, ShoppingCart } from "lucide-react";
import ButtonLink from "../ui/ButtonLink";

type Props = {
  isOpen: boolean;
  close: () => void;
  itemCount?: number;
  children?: React.ReactNode;
};

export default function CartDrawer({ isOpen, close, itemCount = 0, children }: Props) {
  const hasItems = itemCount > 0;

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
        className={`fixed top-0 right-0 w-full md:w-96 h-screen bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-700 cursor-pointer
          transform transition-transform duration-300 hover:rotate-90"
          onClick={close}
        >
          <X className="w-6 h-6" strokeWidth={1} />
        </button>

        {/* Content */}
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <p className="font-regular text-lg">Panier d'achat</p>
            {hasItems && (
              <span className="inline-flex items-center justify-center bg-(--primary) text-white text-xs font-bold w-5 h-5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>

          {hasItems ? (
            <>
              <div className="flex-1 overflow-y-auto">{children}</div>
              {/* Sous-total affiché uniquement si il y a des produits */}
              <div className="mt-auto flex justify-between items-center font-semibold uppercase text-lg pt-4 border-t border-gray-200">
                <p>Sous-total :</p>
                <p>00,00 €</p>
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
