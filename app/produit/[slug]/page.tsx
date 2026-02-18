import ColorChart from "@/components/product/ColorChart";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import BuyTogether from "@/components/sections/BuyTogether";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import { Metadata } from "next";
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

type ProductCategory = {
    id: number;
    name: string;
    slug?: string;
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
    related_products?: {
        id: number;
        name: string;
        slug: string;
        price: string;
        main_image: string | null;
    }[];
};

type Props = {
    params: Promise<{ slug: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eightyone-store.fr';

async function fetchProduct(slug: string): Promise<Product> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/slug/${slug}`, 
        { cache: "no-store" }
    );
    
    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    
    return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const product = await fetchProduct(slug);

        return {
            title: `${product.name} | Eightyone Store`,
            description: product.description?.substring(0, 160) || `Découvrez ${product.name} sur Eightyone Store.`,
            alternates: {
                canonical: `${BASE_URL}/produit/${slug}`,
            },
            openGraph: {
                title: `${product.name} - Eightyone Store`,
                description: product.description?.substring(0, 160),
                url: `${BASE_URL}/produit/${slug}`,
                siteName: 'Eightyone Store',
                images: [{ url: product.main_image, width: 800, height: 800, alt: product.name }],
                locale: 'fr_FR',
                type: 'website',
            },
        };
    } catch (error) {
        return { title: "Produit introuvable - Eightyone Store" };
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await fetchProduct(slug);

    // Détection Urban Wear
    const isUrbanWear = product.categories.some(cat => cat.slug === 'urban-wear');

    const crumbs: { label: string; href?: string }[] = [{ label: "Accueil", href: "/" }];
    let currentPath = "";
    product.categories.forEach((cat) => {
        currentPath += `/${cat.slug ?? cat.name.toLowerCase().replace(/\s+/g, '-')}`;
        crumbs.push({ label: cat.name, href: currentPath });
    });
    crumbs.push({ label: product.name });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.main_image,
        "description": product.description?.substring(0, 200),
        "sku": product.variants[0]?.sku || `EO-${product.id}`,
        "brand": { "@type": "Brand", "name": "Eightyone Store" },
        "offers": {
            "@type": "Offer",
            "url": `${BASE_URL}/produit/${slug}`,
            "priceCurrency": "EUR",
            "price": product.price,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": { "@type": "Organization", "name": "Eightyone Store" }
        }
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="max-w-6xl mx-auto pt-8 pb-16 px-6">
                <Breadcrumbs crumbs={crumbs} />
                <div className="flex flex-col md:flex-row md:items-start gap-10 md:pt-12">
                    <div className="md:w-3/5">
                        <ProductGallery mainImage={product.main_image} images={product.images} alt={product.name} />
                    </div>
                    <div className="md:w-2/5">
                        <ProductInfo product={product} isUrbanWear={isUrbanWear} />
                    </div>
                </div>
                <ColorChart 
                    productId={product.id} 
                    variants={product.variants} 
                    title={isUrbanWear ? "Tailles disponibles" : "Nuancier"}
                />
            </div>
            <BuyTogether products={product.related_products} />
        </div>
    );
}