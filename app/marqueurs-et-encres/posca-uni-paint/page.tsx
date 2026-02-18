import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "posca-uni-paint" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/posca-uni-paint`,
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
    title: "Marqueurs Posca & Uni Paint : Peinture Acrylique et Huile | Eightyone Store",
    description: "Retrouvez toute la gamme Posca et Uni Paint. Les marqueurs de référence pour dessiner sur textile, bois, métal et verre avec une couvrance pro."
};

export default async function Squeezers() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les Posca & Uni Paint" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Posca & Uni Paint"
                description="Le marqueur incontournable pour tous les travaux d’arts graphiques ! Décliné en de nombreuses couleurs, ce marqueur permanent possède un fort pouvoir couvrant."
                backgroundImage="/bandeau-poscaunipaint.png"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Posca & Uni Paint" />

        </div>
    );
}
