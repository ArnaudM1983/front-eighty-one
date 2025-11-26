"use client";

import { useState } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: number;
  quantity: number;
  stock: number;
  onAdd?: (productId: number, quantity: number) => void;
};

const AddToCartButton = ({ productId, quantity, stock, onAdd }: Props) => {
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart(); // Connexion au contexte panier

  const handleClick = () => {
    if (stock === 0) return;

    setLoading(true);

    addToCart({ id: productId, quantity }); // Panier mis à jour 

    onAdd?.(productId, quantity);

    setTimeout(() => setLoading(false), 300);
  };

  return (
    <ButtonLink
      onClick={handleClick}
      className="px-6 py-2"
    >
      {loading
        ? "Ajout en cours..."
        : stock === 0
        ? "Rupture de stock"
        : "Ajouter au panier"}
    </ButtonLink>
  );
};

export default AddToCartButton;
