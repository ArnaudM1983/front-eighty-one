import ColorChart from "@/components/product/ColorChart";
import { notFound } from "next/navigation";

type ProductVariant = {
    id: number;
    name: string;
    sku: string | null;
    price: string;
    stock: number;
    image: string | null;
    attributes: Record<string, any>;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    price: string;
    stock: number;
    main_image: string;
    featured: boolean;
    description: string;
    images: { id: number; url: string; alt?: string }[];
    variants: ProductVariant[];
};


type Props = {
    params: { slug: string } | Promise<{ slug: string }>;
};

async function fetchProduct(slug: string): Promise<Product> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/slug/${slug}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error(`Failed to fetch product: ${res.status}`);
    }

    return res.json();
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;

    const product = await fetchProduct(slug);

    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            {/* Image parent */}
            <img
                src={`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}${product.main_image}`}
                alt={product.name}
                className="w-full h-96 object-cover rounded"
            />

            <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
            <p className="text-xl text-gray-800 mt-2">{product.price} €</p>
            <p className="mt-4">{product.description}</p>
            <p className="mt-2 font-medium">Stock: {product.stock}</p>

            {/* Nuancier */}
            <ColorChart variants={product.variants} />
        </div>
    );
}

