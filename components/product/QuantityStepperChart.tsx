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

  useEffect(() => {
    setCurrentQty(quantity);
  }, [quantity]);

  useEffect(() => {
    if (stock <= 0) {
      setCurrentQty(0);
      onChange?.(0);
    }
  }, [stock]);

  const decrement = () => {
    const newQty = Math.max(0, currentQty - 1);
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
        disabled={currentQty <= 0}
        onClick={decrement}
        aria-label="Diminuer la quantité"
        className="cursor-pointer text-sm px-2 disabled:opacity-40"
      >
        -
      </button>
      
      <span 
        className={`
          mx-1 px-2 py-0.5 min-w-[24px] rounded-sm transition-colors duration-200
          ${currentQty > 0 ? 'bg-(--secondary) text-black' : 'bg-transparent text-gray-900'}
        `}
      >
        {currentQty}
      </span>

      <button
        type="button"
        disabled={currentQty >= stock}
        onClick={increment}
        aria-label="Augmenter la quantité"
        className="cursor-pointer text-sm px-2 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepperChart;