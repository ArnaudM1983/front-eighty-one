import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "acryliques" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/acryliques`,
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
    title: "Bombes de Peinture Acrylique & Base Eau au Meilleur Prix | Eightyone Store",
    description: "Large choix de bombes de peinture acryliques sans solvant (Water Based). Idéales pour l'intérieur, les ateliers et les beaux-arts. Livraison France ou retrait à Lyon !"
};

export default async function Acryliques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les acryliques" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (Nested Products) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/bombes-de-peinture/acryliques",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Acheter ${product.name} chez Eightyone Store Lyon.`,
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
            {/* Injection du JSON-LD optimisé */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Bombes de Peinture Acryliques"
                description="Parfaites pour un usage en intérieur, les bombes de peinture acryliques (Water Based) sont sans solvant et quasiment sans odeur. Idéales pour les ateliers avec enfants, les travaux de beaux-arts ou la décoration, ces sprays à base d'eau offrent une couvrance pro et une résistance durable sur tous supports une fois secs."
                backgroundImage="/acryliques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Acryliques" />
        </div>
    );
}