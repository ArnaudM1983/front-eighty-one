import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "acryliques" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/acryliques`,
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
    title: "Acryliques - Eightyone Store",
    description: "Découvrez notre large sélection de bombes de peinture acryliques"
};

export default async function Acryliques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les acryliques" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Acryliques"
                description="Bombes de peinture sans solvant et à base d’eau, les bombes de peinture acryliques sont idéales pour un usage intérieur ou ludique, du fait de son absence d’odeur. Sa couvrance et sa résistance sont équivalentes aux bombes de peinture classiques."
                backgroundImage="/acryliques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Acryliques" />

        </div>
    );
}
