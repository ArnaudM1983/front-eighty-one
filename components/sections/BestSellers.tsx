import ProductCard from "../product/ProductCard";

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    main_image: string;
    featured: boolean;
};

async function fetchProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products`,
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

export default async function BestSellers() {
  
  const products: Product[] = await fetchProducts();

  // Filter only featured products
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="px-4 py-16 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <h4>Nos Best-sellers</h4>
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}