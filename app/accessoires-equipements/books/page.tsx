import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "books" category.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/books`,
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
    title: "Livres Graffiti, Street Art & Blackbooks (Sketchbooks) | Eightyone Store",
    description: "Librairie spécialisée graffiti à Lyon. Large choix de livres d'art urbain, magazines et blackbooks professionnels (carnets de croquis) Montana."
};

export default async function BooksPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les books" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.eightyonestore.com/accessoires-equipements/books",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 30).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://www.eightyonestore.com/produit/${product.slug}`,
          "image": product.main_image || product.imageMain,
          "description": `Livre ou carnet de dessin graffiti : ${product.name}.`,
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
            {/* Injection du JSON-LD pour Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <main>
                <CategoryHero
                    title="Books & Blackbooks"
                    description="Explorez notre sélection dédiée à la culture visuelle urbaine. De l'histoire du graffiti aux monographies d'artistes internationaux, nous proposons des livres de référence et des magazines spécialisés. Pour les créatifs, découvrez nos blackbooks et carnets de croquis (sketchbooks) haut de gamme, dotés de papier spécifique pour résister à l'encre des marqueurs et sublimer vos esquisses."
                    backgroundImage="/bandeau-books.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Books & Sketchbooks" />
            </main>
        </div>
    );
}