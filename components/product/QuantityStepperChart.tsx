"use client";

import { useState, useEffect } from "react";

type Props = {
  quantity?: number;
  stock: number;
  onChange?: (qty: number) => void;
};

const QuantityStepperChart = ({ 
  quantity = 0, 
  stock, 
  onChange }: Props) => {
  const [currentQty, setCurrentQty] = useState(quantity);

  // Sync le set du parent
  useEffect(() => {
    setCurrentQty(quantity);
  }, [quantity]);

  // Reset si rupture
  useEffect(() => {
    if (stock <= 0) {
      setCurrentQty(0);
      onChange?.(0);
    }
  }, [stock]);

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

  const commonClasses =
    "mt-2 rounded-3xl text-center text-sm font-medium flex items-center justify-center";
  const height = "32px";
  const minWidth = "76px";

  if (stock <= 0) {
    return (
      <div className={`${commonClasses} bg-red-400 text-white text-[10px] px-2`} style={{ height, minWidth }}>
        Rupture temporaire
      </div>
    );
  }

  return (
    <div className={`${commonClasses} border border-gray-400 bg-white`} style={{ height, minWidth }}>
      <button
        type="button"
        disabled={currentQty <= 1}
        onClick={decrement}
        className="cursor-pointer text-sm px-2 disabled:opacity-40"
      >
        -
      </button>
      <span className="px-2">{currentQty}</span>
      <button
        type="button"
        disabled={currentQty >= stock}
        onClick={increment}
        className="cursor-pointer text-sm px-2 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepperChart;
