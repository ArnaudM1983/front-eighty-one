import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "squeezers" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/marqueurs-squeezers-vides`,
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
    title: "Marqueurs & Squeezers vides - Eightyone Store",
    description: "Découvrez notre large sélection de marqueurs et squeezers vides"
};

export default async function Squeezers() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les marqueurs et squeezers vides" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Marqueurs & Squeezers vides"
                description="Facile à remplir, les marqueurs vides sont pratiques et économiques. Ils permettent de faire vos propres mélanges d’encres et peuvent êtres remplis autant de fois que voulu."
                backgroundImage="/bandeau-marqueur-squeezer-vides.png"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Marqueurs et Squeezers vides" />

        </div>
    );
}
