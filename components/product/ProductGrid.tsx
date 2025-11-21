import ProductCard from "./ProductCard";

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    main_image: string;
};

type Props = {
    products: Product[];
};

export default function ProductGrid({ products }: Props) {
    if (!products || products.length === 0) {
        return <p>Aucun produit trouvé.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
