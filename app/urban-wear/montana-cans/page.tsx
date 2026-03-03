import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "classiques" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/montana-cans`,
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
    title: "Montana Cans | Urban Wear & Streetwear Lyon",
    description: "Découvrez la gamme de vêtements Montana Cans chez Eightyone Store. Hoodies, t-shirts et collaborations exclusives avec les meilleurs graffeurs mondiaux."
};

export default async function Classiques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Urban Wear", href: "/urban-wear" },
        { label: "Montana Cans" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Montana Cans"
                description="La gamme wear de Montana propose des vêtements simples mais très qualitatifs ou des collaborations régulières avec les meilleurs artistes / graffeurs européens et mondiaux."
                backgroundImage="/bandeau-urban-wear.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Montana Cans" />

        </div>
    );
}
