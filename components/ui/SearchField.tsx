"use client";
import { forwardRef } from "react";

type Props = {
  isHome: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const SearchField = forwardRef<HTMLInputElement, Props>(({ isHome, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      placeholder="Rechercher un produit..."
      className={`w-full border-b bg-transparent outline-none text-lg pb-2 ${
        isHome
          ? "placeholder-white/70 border-white text-white"
          : "placeholder-black/50 border-black text-black"
      }`}
      {...props}
    />
  );
});

SearchField.displayName = "SearchField";
export default SearchField;
