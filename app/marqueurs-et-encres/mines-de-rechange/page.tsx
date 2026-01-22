import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "squeezers" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/mines-de-rechange`,
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
    title: "Mines de rechange - Eightyone Store",
    description: "Découvrez notre large sélection de mines de rechange"
};

export default async function Squeezers() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les mines de rechange" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Mines de rechange"
                description="Indispensables pour assurer une plus grande durée de vie à son marqueur ou son squeezer préféré, vous trouverez ici toutes les tailles de mines de rechanges pour repartir avec un marqueur comme neuf !"
                backgroundImage="/bandeau-mines.png"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Mines de rechange" />

        </div>
    );
}
