import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "encres" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/encres`,
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
    title: "Encres de Recharge pour Marqueurs & Squeezers | Eightyone Store Lyon",
    description: "Large choix d'encres permanentes et peintures liquides pour recharger vos marqueurs. On The Run, Infamy, Mefians Ink. Haute résistance UV et couvrance pro à Lyon !"
};

export default async function EncresPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les encres" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/marqueurs-et-encres/encres",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Encre de recharge ${product.name} pour marqueur et squeezer.`,
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
            {/* Injection du JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <main>
                <CategoryHero
                    title="Encres de Recharge & Peintures Liquides"
                    description="Donnez une seconde vie à vos outils avec notre sélection d'encres de recharge professionnelles. Que vous cherchiez une encre à base d'alcool ultra-permanente, une peinture fluide pour squeezer ou une encre acrylique pour vos travaux d'arts graphiques, nous avons sélectionné les meilleures marques : On The Run, Infamy, Mefians Ink. Qualité testée pour une couvrance maximale et une résistance longue durée."
                    backgroundImage="/bandeau-encres.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Encres" />
            </main>
        </div>
    );
}