import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "stickers-book" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
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
        // Throw an error to trigger error.tsx
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
}

export const metadata = {
    title: "Stickers & books - Eightyone Store",
    description: "Découvrez notre large sélection de stickers & books"
};

export default async function Stickers() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les stickers & books" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Stickers & books"
                description="Idéal pour gagner en visibilité, les stickers vous offrent un support adapté et durable pour l’utilisation des marqueurs. Les carnets, quant à eux, sont des indispensables, aussi bien pour l’entraînement (sketching) que pour récolter des dessins et œuvres de vos artistes préférés au fil des rencontres."
                backgroundImage="/stickers.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Stickers & books" />

        </div>
    );
}
