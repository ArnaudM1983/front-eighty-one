import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "posca-uni-paint" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/posca-uni-paint`,
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

export const metadata = {
    title: "Marqueurs Posca & Uni Paint au Meilleur Prix | Eightyone Store Lyon",
    description: "Toute la gamme Posca (acrylique) et Uni Paint (huile) en stock. Feutres peinture pour dessin, textile, custom de baskets, bois et verre. Livraison 24/48h ou retrait à Lyon !"
};

export default async function PoscaUniPaintPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les Posca & Uni Paint" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/marqueurs-et-encres/posca-uni-paint",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Marqueur peinture ${product.name} multi-supports.`,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "EUR",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }
      }))
    };

    return (
        <div>
            {/* Injection du JSON-LD pour les Rich Snippets Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <main>
                <CategoryHero
                    title="Marqueurs Posca & Uni Paint"
                    description="Références mondiales de la customisation et du dessin pro, les marqueurs Posca (base eau) et Uni Paint (base huile) s'adaptent à toutes vos envies créatives. Que ce soit pour dessiner sur textile, personnaliser des baskets, peindre sur bois, métal ou verre, ces feutres de peinture permanents offrent une opacité exceptionnelle. Retrouvez toutes les tailles de pointes, du PC-1MR au PC-8K, ainsi que les mythiques Uni Paint PX-20 et PX-30."
                    backgroundImage="/bandeau-poscaunipaint.png"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Posca & Uni Paint" />
            </main>
        </div>
    );
}