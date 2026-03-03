import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "books" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
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
        // Throw an error to trigger error.tsx
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
}

export const metadata = {
    title: "Books & Blackbooks (Sketchbooks) | Eightyone Store",
    description: "Librairie graffiti & Street Art : découvrez notre sélection de livres de référence et blackbooks professionnels chez Eightyone Store Lyon. Culture et sketching."
};

export default async function Stickers() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les books" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Books"
                description="De l'histoire du graffiti aux monographies d'artistes internationaux, notre sélection de livres célèbre la culture urbaine sous toutes ses formes. Retrouvez également nos blackbooks et carnets de croquis haut de gamme, conçus pour résister à l'encre et sublimer vos esquisses les plus détaillées."
                backgroundImage="/bandeau-books.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Books" />

        </div>
    );
}
