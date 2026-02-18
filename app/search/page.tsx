"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/ui/Pagination";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  main_image: string;
};

// 1. On crée un sous-composant qui contient toute la logique de recherche
function SearchContent() {
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

// 2. Le composant principal exporté par défaut
// Il enveloppe le tout dans Suspense pour que Vercel accepte le build
export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Suspense fallback={<div className="text-gray-500">Chargement de la recherche...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}