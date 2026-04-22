import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "marqueurs-squeezers-vides" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/marqueurs-squeezers-vides`,
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
    title: "Marqueurs Vides & Squeezers à Remplir : Montana, OTR, Best Ink | Eightyone Store",
    description: "Créez vos propres mélanges avec nos marqueurs et squeezers vides. Retrouvez les outils rechargeables Montana, On The Run (OTR) et Best Ink au meilleur prix à Lyon !"
};

export default async function VidesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les marqueurs et squeezers vides" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/marqueurs-et-encres/marqueurs-squeezers-vides",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Marqueur ou squeezer vide rechargeable ${product.name}.`,
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
                    title="Marqueurs & Squeezers Vides à Remplir"
                    description="Économiques et entièrement personnalisables, nos marqueurs et squeezers vides sont les outils parfaits pour les artistes souhaitant créer leurs propres teintes. Retrouvez les références incontournables de chez Montana Cans, On The Run (OTR) et Best Ink. Faciles à remplir avec vos encres ou peintures fluides, ces corps de marqueurs rechargeables permettent de varier les pointes et les débits pour un rendu unique."
                    backgroundImage="/bandeau-marqueur-squeezer-vides.png"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Marqueurs et Squeezers vides" />
            </main>
        </div>
    );
}