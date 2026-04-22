import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "protections-equipements" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/protections-equipements`,
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
    title: "Protections Graffiti & Équipement : Masques 3M, Gants & Cellograff | Eightyone Store",
    description: "Équipez-vous pour peindre en toute sécurité : masques 3M, gants Montana, sacs de transport et cellophane noir pour le Cellograff. Stock pro disponible à Lyon !"
};

export default async function ProtectionsPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les protections & équipements" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/accessoires-equipements/protections-equipements",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Équipement de protection et logistique graffiti : ${product.name}.`,
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
                    title="Protections & Équipements"
                    description="Pratiquez le graffiti et les arts urbains en toute sécurité. Protégez votre santé avec nos masques 3M anti-vapeurs toxiques et nos gants (Montana, Molotow). Retrouvez également tout le nécessaire logistique : sacs de transport pour vos bombes, adhésifs de masquage pour vos tracés nets et cellophane noir haute résistance pour vos sessions de Cellograff."
                    backgroundImage="/accessoires.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Protections & équipements" />
            </main>
        </div>
    );
}