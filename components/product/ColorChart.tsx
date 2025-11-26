"use client";

import { useState } from "react";

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

import SearchBar from "@/components/ui/SearchBar";
import QuantityStepperChart from "./QuantityStepperChart";

const ColorChart = ({ variants }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!variants || variants.length === 0) return null;

  // Filtrage en fonction de la recherche
  const filteredVariants = variants.filter((variant) =>
    variant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-8">
      <h4 className="mb-4 text-lg font-semibold">Nuancier</h4>

      {/* Search bar */}
      <SearchBar
        placeholder="Rechercher une variante..."
        onSearch={(query) => setSearchQuery(query)}
      />

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
              <p className="text-xs text-center mt-2 lowercase wrap-break-word whitespace-normal">
                {lastWord}
              </p>

              {/* QuantityStepper avec stock */}
              <QuantityStepperChart
                stock={variant.stock}
                quantity={1}
                onChange={(qty) => console.log(`Variant ${variant.id} qty:`, qty)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorChart;
