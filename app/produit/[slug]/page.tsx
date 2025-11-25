import ColorChart from "@/components/product/ColorChart";
import ProductGallery from "@/components/product/ProductGallery";
import Breadcrumbs from "@/components/ui/Breadcrumb";
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
    categories: ProductCategory[];
};


type ProductCategory = {
    id: number;
    name: string;
    slug?: string;
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

    const crumbs = [
        { label: "Accueil", href: "/" },
        ...product.categories.map(cat => ({
            label: cat.name,
            href: `/products/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`
        })),
        { label: product.name }
    ];

    return (
        <div className="max-w-6xl mx-auto pt-8 px-6">

            {/* Breadcrumb */}
            <Breadcrumbs crumbs={crumbs} />

            <div className="flex flex-col md:flex-row md:items-start gap-10 pt-12">
                {/* Galerie Images */}
                <ProductGallery
                    mainImage={product.main_image}
                    images={product.images}
                    alt={product.name}
                />

                {/* Infos produit */}
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-xl text-gray-800 mt-2">{product.price} €</p>
                    <p className="mt-4">{product.description}</p>
                    <p className="mt-2 font-medium">Stock: {product.stock}</p>
                </div>
            </div>

            {/* Nuancier */}
            <ColorChart variants={product.variants} />
        </div>
    );

}

