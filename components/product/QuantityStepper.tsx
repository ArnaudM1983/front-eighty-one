"use client";

import { useState, useEffect } from "react";

type Props = {
    productId: number;
    quantity: number;
    onChange: (newQty: number) => void;
    isCart?: boolean;
};

export default function QuantityStepper({
    productId,
    quantity,
    onChange,
    isCart = false
}: Props) {
    const [stock, setStock] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const commonClasses =
        "mt-2 rounded-3xl text-center text-sm font-medium flex items-center justify-center";
    const height = "32px";
    const minWidth = "76px";

    useEffect(() => {
        if (!isCart) {
            fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/${productId}/stock`)
                .then(res => res.json())
                .then(data => setStock(data.stock))
                .catch(() => setStock(null));
        }
    }, [productId, isCart]);

    const disableIncrement =
        (!isCart && stock !== null && quantity >= stock) ||
        (!isCart && stock === 0);

    const disableDecrement = quantity <= 1;

    const update = (newQty: number) => {
        if (!isCart && stock !== null && newQty > stock) {
            newQty = stock;
        }
        onChange(newQty);
    };

    return (
        <div
            className={`${commonClasses} border border-gray-400 bg-white`}
            style={{ height, minWidth }}
        >
            <button
                className="cursor-pointer text-sm px-2 disabled:opacity-40"
                onClick={() => update(quantity - 1)}
                disabled={disableDecrement}
            >
                -
            </button>

            <span className="px-2">{quantity}</span>

            <button
                className="cursor-pointer text-sm px-2 disabled:opacity-40"
                onClick={() => update(quantity + 1)}
                disabled={disableIncrement}
            >
                +
            </button>
        </div>
    );
}
