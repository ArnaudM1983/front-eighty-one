import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "collector" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/collector-editions-limitees`,
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
    title: "Bombes de Peinture Collector & Éditions Limitées | Eightyone Store Lyon",
    description: "Séries limitées et collaborations exclusives Montana Colors, Double-A et plus. Retrouvez des bombes de collection signées par des artistes internationaux."
};

export default async function CollectorPage() { 
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les collectors" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/bombes-de-peinture/collector",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Édition limitée de collection : ${product.name}.`,
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

            <CategoryHero
                title="Bombes Collector & Éditions Limitées"
                description="Véritables pièces de collection, nos bombes en édition limitée célèbrent la culture graffiti mondiale. Retrouvez des collaborations mythiques avec des artistes de renom. Stock ultra-limité pour collectionneurs et passionnés d'art urbain."
                backgroundImage="/classiques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Collectors - Editions limitées" />
        </div>
    );
}