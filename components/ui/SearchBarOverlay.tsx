"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchField from "./SearchField";
import Link from "next/link";
import { X } from "lucide-react";
import ButtonLink from "./ButtonLink";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  main_image: string;
};

type Props = {
  isOpen: boolean;
  isHome: boolean;
  onClose: () => void;
};

export default function SearchBarOverlay({ isOpen, isHome, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);  // 🔥 nouveau
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Focus sur l'input quand la searchbar s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // 🔥 Fermeture si clic en dehors
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Si on clique sur le bouton Search → on ne ferme PAS
      if (target.closest("[data-search-button]")) return;

      // Si clic hors du container → on ferme
      if (overlayRef.current && !overlayRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // FETCH
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_SYMFONY_API_URL;
        const res = await fetch(`${apiUrl}/api/products/search?q=${encodeURIComponent(query)}`);

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const limitedResults = results.slice(0, 5);

  return (
    <>
      {/* BACKDROP */}
      <div
        className="absolute left-0 top-full w-full h-[calc(100vh-5rem)] backdrop-blur-sm bg-black/20 z-10"
        style={{ pointerEvents: "none" }}
      />
      
      <div ref={overlayRef} className="relative z-20 px-6 lg:px-16 py-4">

        {/* Champ de recherche */}
        <div className="relative">
          <SearchField
            ref={inputRef}
            isHome={isHome}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />

          {/* Bouton clear */}
          {query.length > 0 && (
            <button
              onClick={clearSearch}
              aria-label="Effacer la recherche"
              className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 
                ${isHome ? "text-white/80" : "text-black/60"}`}
            >
              <X className="w-5 h-5 text-gray-500 hover:text-red-700 cursor-pointer transform transition-transform duration-300 hover:rotate-90" />
            </button>
          )}
        </div>

        {/* Résultats */}
        {loading && <div className={`mt-2 ${isHome ? "text-white/70" : "text-gray-500"}`}>Recherche...</div>}

        {!loading && results.length === 0 && query && (
          <div className={`mt-2 ${isHome ? "text-white/70" : "text-gray-500"}`}>Aucun produit trouvé</div>
        )}

        {limitedResults.length > 0 && (
          <ul
            className={`
              mt-2 rounded-md overflow-hidden border
              ${isHome ? "bg-black border-white/20 text-white shadow-lg" : "bg-white border-gray-200 text-black shadow-md"}
            `}
          >
            {limitedResults.map((product) => (
              <li
                key={product.id}
                className={`
                  p-3 cursor-pointer transition
                  ${isHome ? "hover:bg-white/10" : "hover:bg-gray-100"}
                `}
                onClick={onClose}
              >
                <Link href={`/produit/${product.slug}`} className="flex-1 flex items-center gap-3">
                  {/* Image produit */}
                  {product.main_image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${product.main_image}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}

                  {/* Nom et prix */}
                  <div className="flex justify-between flex-1">
                    <span>{product.name}</span>
                    <span className="font-semibold">{product.price} €</span>
                  </div>
                </Link>
              </li>
            ))}

            {results.length > 5 && (
              <li
                className="p-3 text-center"
                onClick={onClose}
              >
                <ButtonLink
                  href={`/search?query=${encodeURIComponent(query)}`}
                  className="block text-center"
                >
                  Voir tous les résultats ({results.length})
                </ButtonLink>
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  );
}
