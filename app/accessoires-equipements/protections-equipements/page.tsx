import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";

/**
 * Fetch products from the Symfony API for the "protections-equipements" category.
 * This function runs on the server-side (Server Component) in Next.js App Router.
 */
async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/protections-equipements`,
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
    title: "Protections Graffiti : Masques 3M, Gants Montana & Cellograff | Eightyone Store",
    description: "Tout l'équipement du graffeur : Masques 3M, gants Montana, cellophane noir pour cellograff, adhésifs de masquage. Sécurité et logistique au meilleur prix."
};

export default async function Protections() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les protections & équipements" }
    ];

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div>
            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <CategoryHero
                title="Protections & équipements"
                description="La pratique du graffiti ou des arts graphiques nécessitent souvent une protection (notamment des masques pour éviter la toxicité des aérosols), idéal pour pratiquer en toute sécurité !"
                backgroundImage="/accessoires.webp"
                scrollTargetId="productGrid"
            />

            <ProductGrid products={products} title="Les Protections & équipements" />

        </div>
    );
}
