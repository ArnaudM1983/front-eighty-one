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

  return (<div className="flex justify-between items-center border-b border-gray-200 py-4 px-4">
    {/* Partie gauche : image + nom + quantité */} <div className="flex items-center gap-4">
      {image && (<div className="w-16 h-16 shrink-0"> <img
        src={image}
        alt={name}
        className="w-full h-full object-cover rounded"
      /> </div>
      )}

      <div className="flex flex-col justify-center max-w-[200px]">
        <p className="font-regular text-sm text-black">{name}</p>
        {variantName && <p className="font-regular text-xs text-gray-500 mb-2">{variantName}</p>}
        <div className="w-[60px] text-black">
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
        className="text-red-500 hover:text-red-700 mb-2"
      >
        <Trash2 className="w-5 h-5 cursor-pointer" strokeWidth={1} />
      </button>
      <p className="font-regular text-sm text-black">{(price * quantity).toFixed(2)}&nbsp;€</p>
    </div>
  </div>


  );
}
