import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "marqueurs" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/marqueurs`,
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
    title: "Marqueurs Peinture & Feutres Tous Supports | Eightyone Store",
    description: "Large gamme de marqueurs encres et peinture déjà remplis. Idéals pour dessiner, taguer ou customiser sur métal, verre, plastique et papier."
};

export default async function Marqueurs() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les marqueurs" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Marqueurs"
                description="Cette sélection de marqueurs déjà remplis vous permettra de tracer, écrire ou dessiner sur tout types de surfaces, quels que soient vos besoins."
                backgroundImage="/home-marker.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Marqueurs" />

        </div>
    );
}
