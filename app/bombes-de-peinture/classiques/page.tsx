import ProductGrid from "@/components/product/ProductGrid";

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

export default async function Classiques() {

    // Fetch products from the API before rendering
    const products = await getProducts();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Bombes de peinture - Classiques</h1>
            <ProductGrid products={products} />
        </div>
    );
}
