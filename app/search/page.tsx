"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/ui/Pagination"; // ← Import

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  main_image: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_SYMFONY_API_URL;
        const res = await fetch(`${apiUrl}/api/products/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setCurrentPage(1);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  // Produits pour la page courante
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div>
      {loading && <div className="text-gray-500">Chargement...</div>}
      {!loading && products.length === 0 && query && (
        <div className="text-gray-600">Aucun produit trouvé.</div>
      )}

      {!loading && currentProducts.length > 0 && (
        <>
          <ProductGrid products={currentProducts} title={`Résultats pour "${query}"`} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
