import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "classiques" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/classiques`,
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
    title: "Classiques - Eightyone Store",
    description: "Découvrez notre large sélection de bombes de peinture classiques"
};

export default async function Classiques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les classiques" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Classiques"
                description="Les bombes de peinture originales, les classiques sont des sprays au solvant offrant un très large choix de couleurs. Proposant un fort pouvoir couvrant et une grande durabilité, elles sont idéales pour les applications extérieures/intérieures sur tout types de surfaces."
                backgroundImage="/classiques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Classiques" />

        </div>
    );
}
