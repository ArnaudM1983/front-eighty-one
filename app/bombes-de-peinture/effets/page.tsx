import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "effets" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/effets`,
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
    title: "Bombes de Peinture à Effets : Craie, UV, Paillettes, Phosphorescente & Textures | Eightyone Store",
    description: "Donnez une dimension unique à vos créations avec nos bombes de peinture à effets. Sprays craie, UV, phosphorescente, paillettes, craquelé ou marbre."
};

export default async function Effets() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les effets" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Effets"
                description="Les gammes Effets offrent des rendus originaux et novateurs dans la pratique des arts graphiques."
                backgroundImage="/effets.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Effets" />

        </div>
    );
}
