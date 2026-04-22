import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "caps" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/caps`,
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
    title: "Caps pour Bombes de Peinture : Fat Caps, Skinny & Calligraphie | Eightyone Store",
    description: "Large choix de caps (diffuseurs) pour bombes de peinture. Fat caps pour le remplissage, Skinny pour les traits fins et caps calligraphiques. Stock pro à Lyon !"
};

export default async function Caps() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les caps" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/bombes-de-peinture/caps",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Buse de diffusion ${product.name} pour spray aérosol.`,
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
                title="Caps & Diffuseurs"
                description="L'outil indispensable pour maîtriser votre débit. Du Skinny Cap pour un trait fin et précis aux Fat Caps pour des remplissages rapides et larges, découvrez notre sélection de buses pour bombes de peinture. Retrouvez les classiques : Fat, Astro Fat, New York Fat et bien d'autres pour varier vos effets."
                backgroundImage="/caps.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Caps" />
        </div>
    );
}