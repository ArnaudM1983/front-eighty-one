"use client"

import { useState, useEffect } from "react";
import SortFilter from "../ui/SortFilter";
import ProductCard from "./ProductCard";
import SearchBar from "../ui/SearchBar";

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    main_image: string;
};

type Props = {
    products: Product[];
    title?: string;
};

export default function ProductGrid({ products, title }: Props) {
    const [sortValue, setSortValue] = useState("default");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);

    // Filtrage et tri à chaque changement de searchQuery ou sortValue
    useEffect(() => {
        let updated = products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Tri selon sortValue
        switch (sortValue) {
            case "price-asc":
                updated.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                updated.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                updated.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                updated.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(updated);
    }, [searchQuery, sortValue, products]);

    if (!products || products.length === 0) {
        return <p>Aucun produit trouvé.</p>;
    }

    return (
        <section id="productGrid" className="bg-(--background-secondary) px-8 pt-16 pb-16">
            <div className="max-w-6xl mx-auto">
                {/* Header avec titre, filtre et recherche */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <SortFilter defaultValue={sortValue} onChange={setSortValue} disabled={false} />
                        <SearchBar onSearch={setSearchQuery} />
                    </div>
                </div>

                {/* Grid des produits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
