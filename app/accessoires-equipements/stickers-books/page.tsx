import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "stickers-book" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/stickers-book`,
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
    title: "Stickers Graffiti & Eggshells Montana Cans | Eightyone Store Lyon",
    description: "Large choix de stickers graffiti : Eggshell indestructibles, Hello My Name Is et stickers Montana Cans. Haute résistance aux intempéries et UV à Lyon !"
};

export default async function StickersPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les stickers" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/accessoires-equipements/stickers-book",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Sticker graffiti ${product.name} haute adhérence.`,
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <main>
                <CategoryHero
                    title="Stickers Graffiti & Eggshells"
                    description="Support incontournable du Street Art, découvrez notre sélection de stickers vierges et collectors. Retrouvez les célèbres stickers Montana Cans et les Eggshells indestructibles, conçus pour une adhérence extrême sur toutes les surfaces urbaines. Résistants aux UV et aux intempéries, ils sont le support idéal pour vos tags au marqueur et vos créations personnalisées."
                    backgroundImage="/stickers.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Stickers Graffiti" />
            </main>
        </div>
    );
}