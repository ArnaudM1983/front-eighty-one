"use client";

import { useState } from "react";
import { Search } from "lucide-react"; 
type Props = {
    placeholder?: string;
    onSearch: (query: string) => void;
};

export default function SearchBar({ placeholder = "Rechercher un produit...", onSearch }: Props) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value); // filtrage en temps réel
    };

    return (
        <div className="relative">
            {/* Icône loupe */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <Search size={24} />
            </div>

            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-8 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none caret-black text-md"
            />
        </div>
    );
}
