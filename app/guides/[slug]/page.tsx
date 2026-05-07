import { notFound } from 'next/navigation';
import Breadcrumbs from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import { Metadata } from "next";
import SliderWrapper from "@/components/ui/SliderWrapper";
import ButtonLink from "@/components/ui/ButtonLink";

type Props = {
    params: Promise<{ slug: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_SYMFONY_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eightyone-store.fr';

/**
 * Composant : Slider des produits recommandés en bas de page
 */
const RelatedProductsSection = ({
    title,
    products,
    description
}: {
    title: string;
    products: any[];
    description?: string
}) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full px-8 pt-20 pb-24 bg-gray-50 border-t border-gray-100 mt-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <div className="flex-1">
                        <div className="text-(--primary) text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                            Equipement recommandé
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-gray-600 max-w-2xl italic border-l-2 border-(--primary) pl-4 text-sm md:text-base">
                                {description}
                            </p>
                        )}
                    </div>
                    <ButtonLink
                        href="/"
                    >
                        Voir tout le shop
                    </ButtonLink>
                </div>

                <SliderWrapper slidesToShow={4} autoplay={true}>
                    {products.map((product) => (
                        <div key={product.id} className="px-2">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </SliderWrapper>
            </div>
        </section>
    );
};

/**
 * Récupère le guide via son slug depuis l'API Symfony
 */
async function getGuide(slug: string) {
    const res = await fetch(`${API_URL}/api/guides/slug/${slug}`, {
        method: "GET",
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

/**
 * Récupération des produits recommandés depuis l'API Symfony
 */
async function fetchExpertProducts(slugs: string[]) {
    if (!slugs || slugs.length === 0) return [];
    try {
        const requests = slugs.map(slug =>
            fetch(`${API_URL}/api/products/slug/${slug}`, {
                cache: "no-store"
            }).then(res => res.ok ? res.json() : null)
        );
        const results = await Promise.all(requests);
        return results.filter(p => p !== null);
    } catch (error) {
        console.error("Erreur Fetch API Products:", error);
        return [];
    }
}

/**
 * Fallback si aucun produit n'est lié
 */
const FALLBACK_PRODUCTS = [
    { id: "f1", name: "Montana BLACK", slug: "mtn-blk-400ml", price: 4.30, main_image: "/api/placeholder/400/400" },
    { id: "f2", name: "Apprêt Universel", slug: "appret-universel-mtn", price: 8.50, main_image: "/api/placeholder/400/400" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const guide = await getGuide(slug);

    if (!guide) return { title: "Guide introuvable | Eightyone" };

    const heroImage = guide.image ? `${API_URL}/${guide.image}` : `${BASE_URL}/default-og-image.jpg`;

    return {
        title: `${guide.title} | Expertise Eightyone Store Lyon`,
        description: guide.description,
        alternates: { canonical: `${BASE_URL}/guides/${slug}` },
        openGraph: {
            title: guide.title,
            description: guide.description,
            url: `${BASE_URL}/guides/${slug}`,
            siteName: 'Eightyone Store',
            images: [
                {
                    url: heroImage,
                    width: 1200,
                    height: 630,
                    alt: guide.title,
                },
            ],
            type: 'article',
        },
        // Optionnel : Pour Twitter/X
        twitter: {
            card: 'summary_large_image',
            title: guide.title,
            description: guide.description,
            images: [heroImage],
        },
    };
}

export default async function GuideDetailPage({ params }: Props) {
    const { slug } = await params;
    const guide = await getGuide(slug);

    if (!guide) notFound();

    // Récupération dynamique des produits de l'expert
    let expertProducts = await fetchExpertProducts(guide.expertChoiceSlugs);
    const hasExpertProducts = expertProducts.length > 0;
    const finalProducts = hasExpertProducts ? expertProducts : FALLBACK_PRODUCTS;

    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Guides & Tutos", href: "/guides" },
        { label: guide.title }
    ];

    // Construction de l'URL d'image absolue
    const heroImage = guide.image ? `${API_URL}/${guide.image}` : "/api/placeholder/1600/700";

    // --- JSON-LD ---
    const guideJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TechArticle",
                "headline": guide.title,
                "description": guide.description,
                "image": heroImage,
                "datePublished": guide.created_at,
                "dateModified": guide.updated_at || guide.created_at,
                "author": {
                    "@type": "Organization",
                    "name": "Eightyone Store",
                    "url": "https://www.eightyonestore.com"
                },
                "publisher": {
                    "@id": "https://www.eightyonestore.com/#organization"
                },
                "articleBody": guide.description
            },
            {
                "@type": "FAQPage",
                "mainEntity": guide.faq?.map((item: any) => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            }
        ]
    };

    return (
        <article className="min-h-screen bg-white text-left">
            {/* --- SCRIPT POUR GOOGLE --- */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
            />
            <div className="max-w-6xl mx-auto px-6">
                <div className="pt-8"><Breadcrumbs crumbs={crumbs} /></div>

                <header className="pt-12 pb-12">
                    <div className="text-(--primary) text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        Tuto & Expertise Eightyone
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6 text-black">
                        {guide.title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl italic border-l-4 border-(--primary) pl-6">
                        {guide.description}
                    </p>
                </header>

                <div className="mb-16 aspect-21/9 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xl border border-gray-100">
                    <img src={heroImage} alt={guide.title} className="w-full h-full object-cover" />
                </div>

                {/* THE SWITCHER */}
                <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
                    <div className="bg-white p-10 md:p-14 border-t-8 border-gray-300 relative">
                        <div className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[11px] mb-5">L'erreur classique</div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 text-gray-900 leading-none">
                            {guide.switcher?.standard?.title}
                        </h3>
                        <div className="space-y-6">
                            {guide.switcher?.standard?.points?.map((point: any, index: number) => (
                                <div key={index} className="flex gap-4">
                                    <span className="text-red-500 font-bold text-xl mt-0.5">✕</span>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        <strong className="text-gray-900 block mb-1">{point.subtitle}</strong>
                                        {point.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black text-white p-10 md:p-14 relative overflow-hidden border-t-8 border-(--primary) transition-all duration-300 group-hover:translate-y-[-5px]">
                        <div className="absolute -bottom-10 -right-10 p-8 opacity-15 font-black text-9xl text-(--primary) leading-none rotate-[-10deg] pointer-events-none">81</div>
                        <div className="text-(--primary) font-bold uppercase tracking-[0.2em] text-[11px] mb-5 relative z-10">Le réflexe pro</div>
                        <p className="text-4xl font-black uppercase tracking-tighter mb-8 relative z-10 leading-none text-white">
                            {guide.switcher?.expert?.title}
                        </p>
                        <div className="space-y-6 relative z-10">
                            {guide.switcher?.expert?.points?.map((point: any, index: number) => (
                                <div key={index} className="flex gap-4">
                                    <div className="bg-(--primary) h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-black">
                                            <path fillRule="evenodd" d="M16.704 4.176a.75.75 0 0 1 .143 1.045l-7.225 10.081a.75.75 0 0 1-1.138.085l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.894 3.894 6.721-9.366a.75.75 0 0 1 1.045-.143Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-white text-sm leading-relaxed">
                                        <strong className="text-(--primary) block mb-1 font-bold">{point.subtitle}</strong>
                                        {point.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-24">
                    <main className="lg:col-span-8">
                        <div
                            className="prose prose-zinc max-w-none text-left
                            [&_p]:mb-6 [&_p]:text-gray-600 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-(--primary) [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4
                            [&_p:first-of-type]:text-xl [&_p:first-of-type]:text-black [&_p:first-of-type]:font-medium [&_p:first-of-type]:border-b [&_p:first-of-type]:pb-6
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-4 [&_ol_li]:text-gray-700
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-4 [&_ul_li]:text-gray-700"
                            dangerouslySetInnerHTML={{ __html: guide.content }}
                        />

                        {/* FAQ */}
                        <section className="bg-gray-50 py-10 px-8 rounded-2xl mt-16 border border-gray-100">
                            <h2 className="text-2xl font-black uppercase text-black mb-8 border-none pl-0!">Les questions posées au shop</h2>
                            <div className="space-y-3">
                                {guide.faq?.map((item: any, index: number) => (
                                    <details key={index} className="group bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                                        <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-800 list-none">
                                            <span>{item.question}</span>
                                            <span className="text-(--primary) transition-transform duration-300 group-open:rotate-180">↓</span>
                                        </summary>
                                        <div className="px-5 pb-5 text-gray-600 text-sm italic border-t border-gray-50 pt-4">{item.answer}</div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </main>

                    <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-black uppercase text-lg mb-1">Shopping List</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Le matos du tuto</p>
                            <div className="flex flex-col gap-4">
                                {finalProducts.slice(0, 3).map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                        <div className="bg-(--primary) text-white rounded-3xl p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">L'avis Eightyone</p>
                                <p className="text-sm font-bold leading-snug">Une question technique ? Nos experts vous conseillent directement au shop de Lyon.</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 text-6xl font-black opacity-20 text-white">81</div>
                        </div>
                    </aside>
                </div>
            </div>

            <RelatedProductsSection
                title={hasExpertProducts ? "La sélection Pro" : "Le matos indispensable"}
                description={hasExpertProducts ? "Retrouvez le matériel utilisé dans ce guide." : "Les incontournables du shop pour réussir votre projet."}
                products={finalProducts}
            />
        </article>
    );
}