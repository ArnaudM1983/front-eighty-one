"use client";

import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import QuantityStepperChart from "./QuantityStepperChart";
import AddToCartButton from "./AddToCartButton";

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
  variants: ProductVariant[];
};

const ColorChart = ({ variants }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!variants || variants.length === 0) return null;

  const filteredVariants = variants.filter((variant) =>
    variant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAllToCart = () => {
    filteredVariants.forEach((variant) => {
      if (variant.stock > 0) {
        console.log(`Ajouter 1x ${variant.name} au panier`);
      }
    });
  };

  return (
    <div className="mt-24" id="ColorChart">

      {/* Titre et SearchBar */}
      <div className="flex items-center justify-between mb-16">
        <h4 className="text-lg font-semibold">Nuancier</h4>
        <SearchBar
          placeholder="Rechercher une couleur..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      {/* Bouton Ajouter au panier */}
      {filteredVariants.length > 0 && (
        <div className="flex justify-center mb-12">
          <AddToCartButton
            productId={0} 
            quantity={1}
            stock={filteredVariants.some(v => v.stock > 0) ? 1 : 0}
            onAdd={handleAddAllToCart}
          />
        </div>
      )}

      {filteredVariants.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">Aucun résultat trouvé</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-12">
          {filteredVariants.map((variant) => {
            const words = variant.name.split(" ");
            const lastWord = words[words.length - 1];

            return (
              <div
                key={variant.id}
                className="col-span-12 md:col-span-1 flex flex-col items-center"
              >
                {variant.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${variant.image}`}
                    alt={variant.name}
                    className="w-full object-cover rounded"
                  />
                )}
                <p className="text-xs text-center mt-2 lowercase break-words whitespace-normal">
                  {lastWord}
                </p>

                <QuantityStepperChart
                  stock={variant.stock}
                  quantity={1}
                  onChange={(qty) =>
                    console.log(`Variant ${variant.id} qty:`, qty)
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Bouton Ajouter au panier */}
      {filteredVariants.length > 0 && (
        <div className="flex justify-center mt-8">
          <AddToCartButton
            productId={0}
            quantity={1}
            stock={filteredVariants.some(v => v.stock > 0) ? 1 : 0}
            onAdd={handleAddAllToCart}
          />
        </div>
      )}
    </div>
  );
};

export default ColorChart;
