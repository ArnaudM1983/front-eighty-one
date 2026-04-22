import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "squeezers" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/squeezers`,
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
    title: "Squeezers Graffiti & Marqueurs Mop : OTR & Infamy | Eightyone Store",
    description: "Réalisez des tags avec des coulures (drips) parfaites. Large choix de squeezers On The Run et Infamy. Marqueurs rechargeables à Lyon !"
};

export default async function SqueezersPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les squeezers" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/marqueurs-et-encres/squeezers",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Marqueur squeezer rechargeable ${product.name} pour coulures et tags.`,
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
                    title="Squeezers & Marqueurs Mops"
                    description="Indispensables pour un tag authentique, nos squeezers et mops sont conçus pour offrir des coulures (drips) maîtrisées et une opacité totale. Retrouvez les références On The Run (OTR) et Infamy. Dotés de pointes en mohair résistantes, ces marqueurs souples et rechargeables permettent de varier la pression pour un débit d'encre sur-mesure sur toutes les surfaces lisses."
                    backgroundImage="/squeezers.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Squeezers" />
            </main>
        </div>
    );
}