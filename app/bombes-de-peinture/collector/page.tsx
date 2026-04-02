import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "collector" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/collector-editions-limitees`,
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
    title: "Bombes de Peinture Collector & Éditions Limitées | Eightyone Store",
    description: "Collectionnez les bombes de peinture en éditions limitées. Retrouvez les collaborations mythiques Montana Cans et Double-A avec les plus grands artistes graffiti."
};

export default async function Classiques() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les collectors" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Collectors - Editions limitées"
                description="Découvrez nos séries limitées et collaborations exclusives. Véritables objets de collection, ces bombes célèbrent l'art urbain à travers des designs uniques créés par des artistes de renommée internationale."
                backgroundImage="/classiques.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Collectors - Editions limitées" />

        </div>
    );
}
