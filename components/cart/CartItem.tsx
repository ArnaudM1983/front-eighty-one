"use client";

import { Trash2 } from "lucide-react";
import QuantityStepperChart from "../product/QuantityStepperChart";

type Props = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  updateQuantity: (id: number, newQty: number) => void;
  removeItem: (id: number) => void;
};

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  updateQuantity,
  removeItem,
}: Props) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 py-4 px-4">
      {/* Partie gauche : image + nom + quantité */}
      <div className="flex items-center gap-4">
        {image && (
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        <div className="flex flex-col justify-center max-w-[200px]">
          <p className="font-regular text-sm text-black">{name}</p>
          <div className="w-[60px] text-black">
            <QuantityStepperChart
              stock={999}
              quantity={quantity}
              onChange={(qty) => updateQuantity(id, qty)}
            />
          </div>
        </div>
      </div>

      {/* Partie droite : bouton supprimer + prix */}
      <div className="flex flex-col items-end justify-between h-full">
        <button
          onClick={() => removeItem(id)}
          className="text-red-500 hover:text-red-700 mb-2"
        >
          <Trash2 className="w-5 h-5 cursor-pointer" strokeWidth={1} />
        </button>
        <p className="font-regular text-sm text-black">{(price * quantity).toFixed(2)} €</p>
      </div>
    </div>
  );
}
