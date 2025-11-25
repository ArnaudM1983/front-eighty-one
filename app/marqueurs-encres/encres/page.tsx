import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "encres" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/encres`,
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
    title: "Encres - Eightyone Store",
    description: "Découvrez notre large sélection d'encres"
};

export default async function Encres() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-encres" },
        { label: "Les encres" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Encres"
                description="De la pratique des arts graphiques à la pratique du tag pur et dur, notre sélection d’encre s’associera parfaitement avec vos marqueurs ou squeezers vides. Étant nous même passionnés, nous testons et sélectionnons pour vous les meilleurs produits du marché !"
                backgroundImage="/bandeau-encres.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Encres" />

        </div>
    );
}
