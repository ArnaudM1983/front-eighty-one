import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "caps" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
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
        // Throw an error to trigger error.tsx
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
}

export const metadata = {
    title: "Caps pour Bombes de Peinture : Fat Caps, Skinny, Original | Eightyone Store",
    description: "Sélection de caps pour bombes de peinture. Retrouvez tous les Fat Caps, Skinny Caps et Original Caps pour une précision d'exécution maximale."
};

export default async function Caps() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les caps" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Caps"
                description="Des plus petits aux plus diffus, le choix des caps est important dans la technique,  et vous aidera à obtenir une plus grande précision d’exécution."
                backgroundImage="/caps.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Effets" />

        </div>
    );
}
