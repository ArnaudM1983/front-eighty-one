import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "techniques" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/techniques`,
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
    title: "Bombes Techniques : Vernis, Apprêts & Nettoyage | Eightyone Store",
    description: "Protégez et préparez vos supports avec nos sprays techniques : vernis mat/brillant, apprêts (primers), acétone et nettoyants caps. Matériel pro à Lyon !"
};

export default async function TechniquesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les techniques" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/bombes-de-peinture/techniques",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Spray technique ${product.name} pour la préparation ou finition peinture.`,
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
                    title="Bombes Techniques & Préparation"
                    description="Indispensables pour la finition ou la préparation de vos supports, nos bombes techniques garantissent un rendu professionnel et durable. Retrouvez nos vernis de protection (mat, satiné, brillant), nos apprêts (primers) pour tous types de surfaces, ainsi que des solutions de nettoyage comme l'acétone pour l'entretien de vos caps et de votre matériel."
                    backgroundImage="/techniques.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Techniques" />
            </main>
        </div>
    );
}