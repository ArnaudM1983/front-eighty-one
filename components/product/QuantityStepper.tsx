"use client"

import { useState } from "react";

type Props = {
    quantity?: number;
    stock: number;
    onChange?: (qty: number) => void;
};

const QuantityStepper = ({ quantity = 0, stock, onChange }: Props) => {
    const [currentQty, setCurrentQty] = useState(quantity);

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
        <div className="flex items-center border rounded-3xl px-4 border-gray-400">
            <button type="button" onClick={decrement} className="cursor-pointer">
                -
            </button>
            <span className=" py-2  text-center w-12">
                {currentQty}
            </span>
            <button type="button" onClick={increment} className="cursor-pointer">
                +
            </button>
        </div>
    );
};

export default QuantityStepper;
