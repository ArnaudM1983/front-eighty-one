"use client";

import { useState, useEffect } from "react";

type Props = {
    quantity?: number;
    stock: number;
    onChange?: (qty: number) => void;
};

const QuantityStepper = ({ quantity = 1, stock, onChange }: Props) => {
    const [currentQty, setCurrentQty] = useState(quantity);

    // Si le stock = 0, forcer la quantité à 0
    useEffect(() => {
        if (stock <= 0) {
            setCurrentQty(0);
            onChange?.(0);
        }
    }, [stock, onChange]);

    if (stock <= 0) {
        return (
            <div className="px-6 py-2 bg-red-400 text-white rounded-3xl text-md font-semibold">
                Rupture de stock
            </div>
        );
    }

    const decrement = () => {
        const newQty = Math.max(1, currentQty - 1);
        setCurrentQty(newQty);
        onChange?.(newQty);
    };

    const increment = () => {
        const newQty = Math.min(stock, currentQty + 1);
        setCurrentQty(newQty);
        onChange?.(newQty);
    };

    return (
        <div className="flex items-center border rounded-3xl px-4  border-gray-400 bg-white">
            <button type="button" onClick={decrement} className="cursor-pointer px-2 text-lg">
                -
            </button>
            <span className="py-2 text-center w-10 text-md font-medium">
                {currentQty}
            </span>
            <button type="button" onClick={increment} className="cursor-pointer px-2 text-lg">
                +
            </button>
        </div>
    );
};

export default QuantityStepper;
