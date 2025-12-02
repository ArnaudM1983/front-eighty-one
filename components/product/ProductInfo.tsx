"use client";

import { useState } from "react";
import QuantityStepper from "./QuantityStepper";
import AddToCartButton from "./AddToCartButton";
import ButtonLink from "@/components/ui/ButtonLink";
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

type ProductCategory = {
  id: number;
  name: string;
  slug?: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock: number;
  main_image: string;
  featured: boolean;
  description: string;
  excerpt?: string | null;
  images: { id: number; url: string; alt?: string }[];
  variants: ProductVariant[];
  categories: ProductCategory[];
};

type Props = {
  product: Product;
};

const ProductInfo = ({ product }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const { refreshCart } = useCart();

  const words = product.name.split(" ");
  const brand = words[0] === "Double" && words[1] ? `${words[0]} ${words[1]}` : words[0];

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/${product.id}/stock`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const availableStock = data.stock;

      if (quantity > availableStock) {
        alert(`Quantité maximale disponible : ${availableStock}`);
        setQuantity(availableStock);
        return;
      }

      await addToCart(product.id, null, quantity);
      refreshCart();
      console.log("Panier mis à jour !");
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier :", err);
    }

  };

  const isParentProduct = product.variants.length > 0;
  const outOfStock = product.stock <= 0;

  return (<div className="flex flex-col gap-8"> <p className="uppercase text-gray-700">{brand}</p> <h2>{product.name}</h2>
    {product.excerpt && <p className="text-gray-600">{product.excerpt}</p>} <p className="text-4xl text-gray-800 font-bold">{product.price} €</p>

    <div className="flex items-center gap-4 mt-4">
      {isParentProduct ? (
        <ButtonLink
          onClick={() => {
            const element = document.getElementById("ColorChart");
            if (element) {
              const offset = 120;
              const top = element.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }}
          className="w-full text-center"
        >
          Voir le nuancier
        </ButtonLink>
      ) : (
        <>
          <QuantityStepper
            productId={product.id}
            quantity={quantity}
            onChange={(qty) => setQuantity(qty)}
          />
          {!outOfStock && (
            <AddToCartButton
              productId={product.id}
              quantity={quantity}
              stock={product.stock}
              onAdd={handleAddToCart}
            />
          )}
        </>
      )}
    </div>

    <p className="text-xs text-gray-500 mt-2">
      Option « click and collect » disponible au moment du paiement
    </p>
  </div>


  );
};

export default ProductInfo;
