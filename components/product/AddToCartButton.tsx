"use client";

import { useState } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import { toast } from "react-toastify";

type Props = {
  productId?: number;
  quantity?: number;
  stock: number;
  onAdd?: () => void;
};

const AddToCartButton = ({ productId, quantity, stock, onAdd }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (stock === 0) return;

    setLoading(true);

    onAdd?.(); // utilise handleAddAllToCart qui contient déjà productId et qty

    toast.success("Produit ajouté au panier !");
    
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
