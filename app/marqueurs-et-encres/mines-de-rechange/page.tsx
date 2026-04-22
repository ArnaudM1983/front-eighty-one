import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "mines-de-rechange" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/mines-de-rechange`,
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
    title: "Mines de Rechange & Pointes Montana, Uni Posca | Eightyone Store Lyon",
    description: "Remplacez vos pointes usées avec nos mines de rechange Montana et Uni Posca. Toutes tailles disponibles pour marqueurs et feutres peinture. Matériel pro à Lyon !"
};

export default async function MinesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les mines de rechange" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/marqueurs-et-encres/mines-de-rechange",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Pointe de remplacement ${product.name} pour marqueur peinture.`,
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
                    title="Mines de Rechange & Pointes"
                    description="Ne jetez plus vos marqueurs ! Prolongez la durée de vie de vos outils préférés avec nos mines de rechange. Que vous cherchiez des pointes de remplacement pour vos feutres Uni Posca ou des mines en fibre pour vos marqueurs Montana Cans, nous proposons toutes les tailles : extra-fines, rondes, biseautées ou XL. Idéal pour retrouver un tracé net et un débit d'encre fluide comme au premier jour."
                    backgroundImage="/bandeau-mines.png"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Mines de rechange" />
            </main>
        </div>
    );
}