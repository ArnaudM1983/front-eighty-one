import ColorChart from "@/components/product/ColorChart";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
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
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/slug/${slug}`, { cache: "no-store" });
        if (res.status === 404) notFound();
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}


export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await fetchProduct(slug);

    const crumbs: { label: string; href?: string }[] = [
        { label: "Accueil", href: "/" }
    ];

    let path = "";
    product.categories.forEach((cat) => {
        path += `/${cat.slug ?? cat.name.toLowerCase().replace(/\s+/g, '-')}`;
        crumbs.push({
            label: cat.name,
            href: path
        });
    });

    // Ajouter le produit à la fin (non cliquable)
    crumbs.push({ label: product.name });

    return (
        <div className="max-w-6xl mx-auto pt-8 px-6">

            {/* Breadcrumb */}
            <Breadcrumbs crumbs={crumbs} />

            <div className="flex flex-col md:flex-row md:items-start gap-10 pt-12">
                {/* Galerie Images */}
                <div className="md:w-3/5">
                    <ProductGallery
                        mainImage={product.main_image}
                        images={product.images}
                        alt={product.name}
                    />
                </div>

                {/* Infos produit */}
                <div className="md:w-2/5">
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* Nuancier */}
            <ColorChart variants={product.variants} />
        </div>
    );

}

