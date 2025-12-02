"use client";

import { useState, useEffect } from "react";

type Props = {
    productId: number;
    quantity?: number;
    stock?: number;
    onChange?: (qty: number) => void;
    isCart?: boolean; // différencie panier / page produit
};

const QuantityStepper = ({
    productId,
    quantity = 1,
    onChange,
    isCart = false,
}: Props) => {
    const [currentQty, setCurrentQty] = useState(quantity);
    const [stock, setStock] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch stock une seule fois au montage ou changement de produit
    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/${productId}/stock`
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setStock(data.stock);


                // Ajuste qty si elle dépasse le stock
                if (quantity > data.stock) {
                    setCurrentQty(data.stock);
                    onChange?.(data.stock);
                } else {
                    setCurrentQty(quantity);
                    onChange?.(quantity);
                }
            } catch (err) {
                console.error("Erreur récupération stock :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStock();


    }, [productId]);

    // Décrémenter la quantité
    const decrement = () => {
        const newQty = Math.max(1, currentQty - 1);
        setCurrentQty(newQty);
        onChange?.(newQty);
    };

    // Incrémenter la quantité avec vérification du stock
    const increment = () => {
        if (stock === null) return;
        if (currentQty >= stock) return;
        const newQty = currentQty + 1;
        setCurrentQty(newQty);
        onChange?.(newQty);
    };

    if (loading) return <div>Chargement...</div>;

    // Mode page produit : rupture si stock nul
    if (!isCart && (!stock || stock <= 0)) {
        return (<div className="px-6 py-2 bg-red-400 text-white rounded-3xl text-md font-semibold">
            Rupture temporaire </div>
        );
    }

    return (<div className="flex items-center border rounded-3xl px-4 border-gray-400 bg-white"> <button type="button" onClick={decrement} className="cursor-pointer px-2 text-lg">
        - </button> <span className="py-2 text-center w-10 text-md font-medium">{currentQty}</span>
        <button
            type="button"
            onClick={increment}
            className={`cursor-pointer px-2 text-lg ${currentQty >= (stock ?? 0) ? "opacity-50 cursor-not-allowed" : ""
                }`}
            disabled={currentQty >= (stock ?? 0)}
        >
            + </button> </div>
    );
};

export default QuantityStepper;
