"use client";

import { useState } from "react";
import QuantityStepper from "./QuantityStepper";
import AddToCartButton from "./AddToCartButton";
import ButtonLink from "@/components/ui/ButtonLink";
import { addToCart } from "@/lib/cartApi";
import { useCart } from "@/context/CartContext";
import DOMPurify from 'dompurify';

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
  isUrbanWear?: boolean;
};

const ProductInfo = ({ product, isUrbanWear }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const { refreshCart } = useCart();

  const words = product.name.split(" ");
  const brand = words[0] === "Double" && words[1] ? `${words[0]} ${words[1]}` : words[0];

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/api/products/${product.id}/stock`, {
        credentials: "include"
      });
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
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier :", err);
    }
  };

  const isParentProduct = product.variants.length > 0;
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="uppercase text-gray-500 text-sm font-semibold tracking-wide mb-1">{brand}</p>
        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2> 
      </div>

      {product.excerpt && (
        <div
          className="editor-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.excerpt) }}
        />
      )}
      <p className="text-4xl text-gray-900 font-bold">{product.price} €</p>

      <div className="mt-4">
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
            className="w-full text-center py-4 text-lg"
          >
            {isUrbanWear ? "Voir les tailles disponibles" : "Voir les couleurs disponibles"}
          </ButtonLink>
        ) : (
          <div className="flex items-center gap-4">
            {outOfStock ? (
              <div className="px-6 py-3 bg-red-50 border border-red-200 text-red-600 font-bold rounded-lg uppercase tracking-wider text-sm w-full text-center select-none">
                Rupture de stock
              </div>
            ) : (
              <>
                <QuantityStepper productId={product.id} quantity={quantity} onChange={(qty) => setQuantity(qty)} />
                <AddToCartButton productId={product.id} quantity={quantity} stock={product.stock} onAdd={handleAddToCart} />
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
        </svg>
        Option « click and collect » disponible au paiement
      </p>
    </div>
  );
};

export default ProductInfo;