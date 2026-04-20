"use client";

import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import QuantityStepperChart from "./QuantityStepperChart";
import AddToCartButton from "./AddToCartButton";
import { addToCart } from "@/lib/cartApi";
import { useCart } from "@/context/CartContext"; 

type ProductVariant = {
  id: number;
  name: string;
  sku: string | null;
  price: string;
  stock: number;
  image: string | null;
  attributes: Record<string, any>;
  active: boolean;
};

type Props = {
  productId: number;
  variants: ProductVariant[];
  title?: string;
};

const ColorChart = ({ productId, variants, title }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const visibleVariants = variants.filter(v => v.active !== false);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    () => Object.fromEntries(visibleVariants.map((v) => [v.id, 0]))
  );

  const { refreshCart } = useCart(); 

  if (!visibleVariants || visibleVariants.length === 0) return null;

  const filteredVariants = visibleVariants.filter((variant) =>
    variant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAllToCart = async () => {
    for (const [id, qty] of Object.entries(quantities)) {
      if (qty > 0) {
        const variant = variants.find((v) => v.id === Number(id));
        if (!variant) continue;
        await addToCart(productId, variant.id, qty);
      }
    }
    await refreshCart();
    setQuantities(Object.fromEntries(variants.map((v) => [v.id, 0])));
  };

  return (
    <div className="mt-24" id="ColorChart">
      <div className="md:flex items-center justify-between mb-16">
        <h4 className="text-lg font-semibold">{title || "Nuancier"}</h4>
        <SearchBar
          placeholder="Rechercher..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      {filteredVariants.length > 0 && (
        <div className="flex justify-center mb-12">
          <AddToCartButton stock={filteredVariants.some(v => v.stock > 0) ? 1 : 0} onAdd={handleAddAllToCart} />
        </div>
      )}

      {filteredVariants.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">Aucun résultat trouvé</p>
      ) : (
        <div className="grid grid-cols-1 md:gap-4 mt-4 md:grid-cols-8 lg:grid-cols-12">
          {filteredVariants.map((variant) => {
            const words = variant.name.split(" ");
            const lastWord = words[words.length - 1];

            return (
              <div 
                key={variant.id} 
                className="col-span-12 md:col-span-1 flex flex-row items-center justify-between h-auto py-2 md:flex-col md:py-0 md:h-40"
              >
                {variant.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${variant.image}`}
                    alt={variant.name}
                    // Mobile: largeur 48px, h-auto, ne coupe pas l'image.
                    // Bureau (md): EXACTEMENT tes classes d'origine.
                    className="w-12 h-auto object-contain shrink-0 md:w-full md:max-w-[100px] md:max-h-[100px] md:object-cover rounded"
                  />
                )}
                <p 
                  // Mobile: aligné à gauche, prend la place centrale (flex-1).
                  // Bureau (md): EXACTEMENT tes classes d'origine.
                  className="text-xs text-left flex-1 px-3 mt-0 md:text-center md:flex-none md:px-0 md:mt-2 wrap-break-word whitespace-normal w-full"
                >
                  {lastWord}
                </p>
                <div className="shrink-0">
                  <QuantityStepperChart
                    stock={variant.stock}
                    quantity={quantities[variant.id] ?? 0}
                    onChange={(qty) => setQuantities((prev) => ({ ...prev, [variant.id]: qty }))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {filteredVariants.length > 0 && (
        <div className="flex justify-center mb-12 mt-12">
          <AddToCartButton stock={filteredVariants.some(v => v.stock > 0) ? 1 : 0} onAdd={handleAddAllToCart} />
        </div>
      )}
    </div>
  );
};

export default ColorChart;