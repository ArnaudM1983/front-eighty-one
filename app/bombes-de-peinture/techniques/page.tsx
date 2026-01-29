import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "techniques" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/techniques`,
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
    title: "Bombes Techniques : Vernis, Apprêts & Acetone | Eightyone Store",
    description: "Préparez et protégez vos œuvres avec nos sprays techniques. Large choix de vernis, apprêts et nettoyants pour le graffiti et les beaux-arts."
};

export default async function Techniques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les techniques" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Techniques"
                description="Indispensables pour la finition ou la préparation, les bombes techniques offrent une qualité de travail incomparable et un rendu optimal."
                backgroundImage="/techniques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Techniques" />

        </div>
    );
}
