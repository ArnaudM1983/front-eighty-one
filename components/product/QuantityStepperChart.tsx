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

    // Style commun pour badge et stepper
    const commonClasses =
        "mt-2 rounded-3xl text-center text-sm font-medium flex items-center justify-center";
    const height = "32px"; 
    const minWidth = "76px"; 

    return stock <= 0 ? (
        <div
            className={`${commonClasses} bg-red-400 text-white text-[10px] px-2`}
            style={{ height, minWidth }}
        >
            Rupture de stock
        </div>
    ) : (
        <div
            className={`${commonClasses} border border-gray-400 bg-white`}
            style={{ height, minWidth }}
        >
            <button
                type="button"
                onClick={decrement}
                className="cursor-pointer text-sm px-2"
            >
                -
            </button>
            <span className="px-2">{currentQty}</span>
            <button
                type="button"
                onClick={increment}
                className="cursor-pointer text-sm px-2"
            >
                +
            </button>
        </div>
    );
};

export default QuantityStepper;
