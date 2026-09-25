"use client";

import { Trash2 } from "lucide-react";
import { showConfirmToast } from "../ui/ConfirmToast";
import QuantityStepper from "../product/QuantityStepper";

type Props = {
  id: number;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
  updateQuantity: (id: number, newQty: number) => void;
  removeItem: (id: number) => void;
};

export default function CartItem({
  id,
  name,
  variantName,
  price,
  quantity,
  image,
  stock,
  updateQuantity,
  removeItem,
}: Props) {
  const handleRemove = () => {
    showConfirmToast({
      message: `Voulez-vous vraiment supprimer ${name} du panier ?`,
      onConfirm: () => removeItem(id),
    });
  };

  const isOutOfStock = typeof stock === "number" && stock === 0;
  const isInsufficientStock = typeof stock === "number" && stock > 0 && quantity > stock;

  return (
    <div className={`flex justify-between items-center border-b border-gray-200 py-4 px-4 transition-colors ${
      isOutOfStock ? "bg-red-50/50 rounded-lg border-red-200" : isInsufficientStock ? "bg-amber-50/50 rounded-lg border-amber-200" : ""
    }`}>
      {/* Partie gauche : image + nom + quantité */}
      <div className="flex items-center gap-4">
        {image && (
          <div className="w-16 h-16 shrink-0 relative">
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover rounded ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
            />
          </div>
        )}

        <div className="flex flex-col justify-center max-w-[240px]">
          <p className="font-regular text-sm text-black">{name}</p>
          {variantName && <p className="font-regular text-xs text-gray-500 mb-1">{variantName}</p>}
          
          {isOutOfStock ? (
            <div className="my-1">
              <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-100/80 px-2 py-0.5 rounded">
                ⚠️ Rupture de stock
              </span>
              <p className="text-[11px] text-red-500 mt-0.5">Veuillez retirer cet article pour commander</p>
            </div>
          ) : isInsufficientStock ? (
            <div className="my-1">
              <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                ⚠️ Stock disponible : {stock}
              </span>
            </div>
          ) : null}

          <div className="w-[60px] text-black mt-1">
            <QuantityStepper
              productId={id}
              quantity={quantity}
              stock={stock}
              onChange={(newQty) => updateQuantity(id, newQty)}
            />
          </div>
        </div>
      </div>

      {/* Partie droite : bouton supprimer + prix */}
      <div className="flex flex-col items-end justify-between h-full">
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 mb-2 p-1"
          title="Supprimer du panier"
        >
          <Trash2 className="w-5 h-5 cursor-pointer" strokeWidth={1} />
        </button>
        <p className={`font-regular text-sm ${isOutOfStock ? "line-through text-gray-400" : "text-black"}`}>
          {(price * quantity).toFixed(2)}&nbsp;€
        </p>
      </div>
    </div>
  );
}
