import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "classiques" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/eighty-one`,
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
    title: "Eightyone Store | Urban Wear & Streetwear Lyon",
    description: "Découvrez la collection Urban Wear exclusive d'Eightyone Store. T-shirts, hoodies et accessoires conçus par et pour la culture graffiti lyonnaise."
};

export default async function Classiques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Urban Wear", href: "/urban-wear" },
        { label: "Eighty One" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Eighty One"
                description="Portez les couleurs du shop. Notre gamme Urban Wear Eighty One est née de la rue et de la passion du graffiti. Des pièces de qualité, sérigraphiées avec soin, pour représenter la scène lyonnaise au quotidien."
                backgroundImage="/classiques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Eighty One" />

        </div>
    );
}
