import ColorChart from "@/components/product/ColorChart";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import BuyTogether from "@/components/sections/BuyTogether";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

// --- TYPES ---
type ProductVariant = {
    id: number;
    name: string;
    sku: string | null;
    price: string;
    stock: number;
    image: string | null;
    attributes: Record<string, any>;
    active: boolean;
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
    excerpt?: string;
    images: { id: number; url: string; alt?: string }[];
    variants: ProductVariant[];
    categories: ProductCategory[];
    faq?: { question: string; answer: string }[];
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

// Configuration globale du nettoyage HTML
const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'details', 'summary', 'br']),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'style'],
        'img': ['src', 'alt', 'width', 'height']
    }
};

const API_URL = process.env.NEXT_PUBLIC_SYMFONY_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eightyonestore.com';

// --- FETCH DATA ---
async function fetchProduct(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(
            `${API_URL}/api/products/slug/${slug}`,
            { cache: "no-store" }
        );

        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        return res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        return null;
    }
}

// --- METADATA (SEO) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const product = await fetchProduct(slug);
        if (!product) return { title: "Produit introuvable - Eightyone Store" };

        const cleanDescription = product.excerpt
            ? product.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 160)
            : product.description.replace(/<[^>]*>?/gm, '').substring(0, 160);

        return {
            title: `${product.name} | Eightyone Store`,
            description: cleanDescription,
            alternates: { canonical: `${BASE_URL}/produit/${slug}` },
            openGraph: {
                title: `${product.name} - Eightyone Store`,
                description: cleanDescription,
                url: `${BASE_URL}/produit/${slug}`,
                siteName: 'Eightyone Store',
                images: [{ url: product.main_image, width: 800, height: 800, alt: product.name }],
                locale: 'fr_FR',
                type: 'website',
            },
        };
    } catch (error) {
        return { title: "Erreur - Eightyone Store" };
    }
}

// --- PAGE PRINCIPALE ---
export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await fetchProduct(slug);

    if (!product) {
        notFound();
    }

    const isUrbanWear = product.categories.some(cat => cat.slug === 'urban-wear');

    const crumbs: { label: string; href?: string }[] = [{ label: "Accueil", href: "/" }];
    let currentPath = "";
    product.categories.forEach((cat) => {
        currentPath += `/${cat.slug ?? cat.name.toLowerCase().replace(/\s+/g, '-')}`;
        crumbs.push({ label: cat.name, href: currentPath });
    });
    crumbs.push({ label: product.name });

    const prices = product.variants?.map(v => parseFloat(v.price)) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : parseFloat(product.price);
    const maxPrice = prices.length > 0 ? Math.max(...prices) : parseFloat(product.price);
    const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || product.stock;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.main_image,
        "description": product.description ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 200) : product.name,
        "sku": product.variants[0]?.sku || `EO-${product.id}`,
        "brand": { "@type": "Brand", "name": "Eightyone Store" },
        "offers": product.variants && product.variants.length > 1 ? {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": minPrice,
            "highPrice": maxPrice,
            "offerCount": product.variants.length,
            "availability": totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        } : {
            "@type": "Offer",
            "url": `${BASE_URL}/produit/${slug}`,
            "priceCurrency": "EUR",
            "price": product.price,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": { "@type": "Organization", "name": "Eightyone Store" }
        }
    };

    const rawText = product.description ? product.description.replace(/<[^>]*>?/gm, '').trim() : '';
    const hasLongDescription = rawText.length > 0;

    return (
        <article className="min-h-screen bg-white text-left">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />

                <header className="flex flex-col md:flex-row md:items-start gap-10 pt-12 pb-16">
                    <div className="md:w-3/5">
                        <ProductGallery mainImage={product.main_image} images={product.images} alt={product.name} />
                    </div>
                    <div className="md:w-2/5">
                        <ProductInfo product={product} isUrbanWear={isUrbanWear} />
                    </div>
                </header>

                <div className="pb-16">
                    <ColorChart
                        productId={product.id}
                        variants={product.variants}
                        title={isUrbanWear ? "Tailles disponibles" : "Nuancier"}
                    />
                </div>

                <hr className="border-t border-gray-100 my-8" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-24 pt-8">

                    <main className="lg:col-span-8">
                        {hasLongDescription ? (
                            <div
                                className="prose prose-zinc max-w-none text-left
                                [&_p]:mb-6 [&_p]:text-gray-600 
                                [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-(--primary) [&_h2]:mt-2 [&_h2]:mb-6 [&_h2]:border-l-4 [&_h2]:border-(--primary) [&_h2]:pl-4
                                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-4
                                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-4 [&_ol_li]:text-gray-700
                                [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-4 [&_ul_li]:text-gray-700
                                [&_strong]:text-black [&_strong]:font-bold"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description, sanitizeOptions) }}
                            />
                        ) : (
                            <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 text-center">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-800 mb-3">
                                    L'expertise Eightyone arrive...
                                </h3>
                                <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">
                                    Notre équipe rédige actuellement les conseils techniques et astuces d'utilisation pour <strong>{product.name}</strong>.
                                </p>
                            </div>
                        )}

                        {product.faq && product.faq.length > 0 && (
                            <section className="bg-gray-50 py-10 px-8 rounded-2xl mt-16 border border-gray-100">
                                <h2 className="text-2xl font-black uppercase text-black mb-8 border-none pl-0!">Les questions posées au shop</h2>
                                <div className="space-y-3">
                                    {product.faq.map((item, index) => (
                                        <details key={index} className="group bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                                            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-800 list-none">
                                                <span>{item.question}</span>
                                                <span className="text-(--primary) transition-transform duration-300 group-open:rotate-180">↓</span>
                                            </summary>
                                            <div
                                                className="px-5 pb-5 text-gray-600 text-sm italic border-t border-gray-50 pt-4"
                                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.answer, sanitizeOptions) }}
                                            />
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                        <div className="bg-(--primary) text-white rounded-3xl p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Dispo au Shop</p>
                                <p className="text-sm font-bold leading-snug">Une question technique sur ce produit ? Passez nous voir au 21 Rue des Capucins, Lyon 1er.</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 text-6xl font-black opacity-20 text-white">81</div>
                        </div>
                    </aside>
                </div>
            </div>

            <BuyTogether products={product.related_products} />
        </article>
    );
}