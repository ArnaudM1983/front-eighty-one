"use client";

import { useState, useEffect } from "react";

type Props = {
    productId: number;
    quantity: number;
    stock?: number;
    onChange: (newQty: number) => void;
};

export default function QuantityStepper({
    productId,
    quantity,
    onChange,
}: Props) {
    const [stock, setStock] = useState<number | null>(null);

    const commonClasses =
        "mt-2 rounded-3xl text-center text-sm font-medium flex items-center justify-center";
    const height = "32px";
    const minWidth = "76px";

    useEffect(() => {
        // Fetch le stock depuis l'API pour ce produit
        fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/${productId}/stock`)
            .then(res => res.json())
            .then(data => setStock(data.stock))
            .catch(() => setStock(null));
    }, [productId]);

    const disableIncrement = stock !== null && quantity >= stock;
    const disableDecrement = quantity <= 1;

    const handleUpdate = (newQty: number) => {
        if (stock !== null && newQty > stock) newQty = stock; // jamais dépasser le stock
        if (newQty < 1) newQty = 1; // minimum 1
        onChange(newQty);
    };

    return (
        <div
            className={`${commonClasses} border border-gray-400 bg-white`}
            style={{ height, minWidth }}
        >
            <button
                className="cursor-pointer text-sm px-2 disabled:opacity-40"
                onClick={() => handleUpdate(quantity - 1)}
                disabled={disableDecrement}
                aria-label="Diminuer la quantité"
            >
                - </button>


            <span className="px-2">{quantity}</span>

            <button
                className="cursor-pointer text-sm px-2 disabled:opacity-40"
                onClick={() => handleUpdate(quantity + 1)}
                disabled={disableIncrement}
                aria-label="Augmenter la quantité"
            >
                +
            </button>
        </div>


    );
}
