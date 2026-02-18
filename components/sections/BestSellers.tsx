import ProductCard from "../product/ProductCard";
import SliderWrapper from "../ui/SliderWrapper";
import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = { containScroll: false }

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    main_image: string;
    featured: boolean;
};

async function fetchFeaturedProducts() {
    // CORRECTION ICI :
    // 1. On ajoute '?featured=true' pour activer le filtre côté serveur (Symfony)
    // 2. On ajoute '&_limit=20' pour récupérer jusqu'à 20 best-sellers (au lieu de la page 1 par défaut)
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products?featured=true&_limit=20`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
}

export default async function BestSellers() {
  
  // L'API nous renvoie maintenant UNIQUEMENT les produits mis en avant
  const featuredProducts: Product[] = await fetchFeaturedProducts();

  // PLUS BESOIN DE FILTRER EN JS ICI
  // Le filtre JS posait problème car il ne filtrais que sur les 20 premiers résultats globaux.
  
  // Si aucun produit n'est mis en avant, on n'affiche pas la section
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-12">Nos Best-sellers</h2>
        <SliderWrapper slidesToShow={4} autoplay={true}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </SliderWrapper>
      </div>
    </section>
  );
}