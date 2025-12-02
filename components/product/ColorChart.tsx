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
};

type Props = {
  productId: number;
  variants: ProductVariant[];
};

const ColorChart = ({ productId, variants }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    () => Object.fromEntries(variants.map((v) => [v.id, 0]))
  );

  const { refreshCart } = useCart(); 

  if (!variants || variants.length === 0) return null;

  const filteredVariants = variants.filter((variant) =>
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
    setQuantities(Object.fromEntries(variants.map((v) => [v.id, 0]))); // reset
  };

  return (
    <div className="mt-24" id="ColorChart">
      <div className="md:flex items-center justify-between mb-16">
        <h4 className="text-lg font-semibold">Nuancier</h4>
        <SearchBar
          placeholder="Rechercher une couleur..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      {filteredVariants.length > 0 && (
        <div className="flex justify-center mb-12">
          <AddToCartButton
            stock={filteredVariants.some(v => v.stock > 0) ? 1 : 0}
            onAdd={handleAddAllToCart}
          />
        </div>
      )}

      {filteredVariants.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">Aucun résultat trouvé</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-8 lg:grid-cols-12">
          {filteredVariants.map((variant) => {
            const words = variant.name.split(" ");
            const lastWord = words[words.length - 1];

            return (
              <div
                key={variant.id}
                className="col-span-12 md:col-span-1 flex flex-col items-center justify-between h-40"
              >
                {variant.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${variant.image}`}
                    alt={variant.name}
                    className="w-full max-w-[100px] max-h-[100px] object-cover rounded"
                  />
                )}
                <p className="text-xs text-center mt-2 break-words whitespace-normal w-full">
                  {lastWord}
                </p>

                <QuantityStepperChart
                  stock={variant.stock}
                  quantity={quantities[variant.id] ?? 0}
                  onChange={(qty) =>
                    setQuantities((prev) => ({ ...prev, [variant.id]: qty }))
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      {filteredVariants.length > 0 && (
        <div className="flex justify-center mt-8">
          <AddToCartButton
            stock={filteredVariants.some(v => v.stock > 0) ? 1 : 0}
            onAdd={handleAddAllToCart}
          />
        </div>
      )}
    </div>
  );
};

export default ColorChart;
