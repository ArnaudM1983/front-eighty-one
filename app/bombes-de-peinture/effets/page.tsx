import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "effets" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/effets`,
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
    title: "Bombes de Peinture à Effets Spéciaux & Textures | Eightyone Store",
    description: "Transformez vos supports avec nos sprays à effets : chrome, paillettes, phosphorescent, UV, craie, effet marbre ou craquelé. Le meilleur du graffiti à Lyon !"
};

export default async function EffetsPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les effets" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/bombes-de-peinture/effets",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Bombe de peinture à effet spécial : ${product.name}.`,
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
                title="Bombes de Peinture à Effets"
                description="Repoussez les limites de la création avec notre sélection de sprays à effets. Que vous recherchiez un rendu phosphorescent, un effet marbre, du chrome haute brillance ou des textures craquelées, nos bombes offrent des finitions innovantes pour le graffiti, le design et le DIY. Découvrez également nos gammes UV et paillettes pour des projets uniques."
                backgroundImage="/effets.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Effets" />
        </div>
    );
}