import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_COLLECTOR = [
    {
        question: "Qu'est-ce qu'une bombe 'Artist Edition' ?",
        answer: "Les Artist Editions sont des bombes produites en série limitée où le design de la canette est confié à un artiste de renommée mondiale (comme Nawas, Insane 51 ou HotDog). Une fois le stock épuisé, ces bombes ne sont jamais rééditées, ce qui en fait des objets de collection prisés."
    },
    {
        question: "Quelle est la différence entre l'Iconic Series et les Artist Editions ?",
        answer: "L'Iconic Series rend hommage aux légendes historiques du graffiti (comme Blade). Elles sont souvent présentées dans des boîtes spécifiques ou avec des finitions premium, tandis que les Artist Editions célèbrent des styles contemporains sur la base technique de la Montana BLACK."
    },
    {
        question: "Les bombes Double A Limited Edition sont-elles utilisables ?",
        answer: "Absolument. Bien que collectionnées pour leur design exclusif (Vim Moas, Damagers Crew), elles contiennent la même peinture de haute qualité que les Double A classiques. Cependant, la plupart des collectionneurs choisissent de ne pas les percuter pour préserver leur valeur."
    },
    {
        question: "Pourquoi les prix varient-ils d'une édition à l'autre ?",
        answer: "Le prix dépend de la rareté de la série, de la complexité du design lithographié sur le métal et de la notoriété de l'artiste ou du crew partenaire. Les séries comme Blade ou Nawas (15.00€) sont produites en quantités encore plus réduites."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/collector-editions-limitees`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
}

export const metadata = {
    title: "Bombes de Peinture Collector & Éditions Limitées | Eightyone Store Lyon",
    description: "Séries limitées exclusives : Montana BLACK Artist Editions (Nawas, Insane 51, HotDog), Iconic Series Blade et Double A Limited (Damagers, Vim Moas)."
};

export default async function CollectorPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les collectors" }
    ];

    const products = await getProducts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": metadata.title,
                "description": metadata.description,
                "url": "https://www.eightyonestore.com/bombes-de-peinture/collector",
                "numberOfItems": products.length,
                "itemListElement": products.slice(0, 20).map((product: any, index: number) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": product.name,
                        "url": `https://www.eightyonestore.com/produit/${product.slug}`,
                        "image": product.main_image || product.imageMain,
                        "offers": {
                            "@type": "Offer",
                            "price": product.price,
                            "priceCurrency": "EUR",
                            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        }
                    }
                }))
            },
            {
                "@type": "FAQPage",
                "mainEntity": FAQ_COLLECTOR.map(item => ({
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
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto pt-8 px-6">
                <Breadcrumbs crumbs={crumbs} />
            </div>

            <main>
                <CategoryHero
                    title="Bombes Collector & Éditions Limitées"
                    description="Véritables pièces de collection, nos bombes célèbrent la culture graffiti mondiale. Retrouvez les Artist Editions de Montana (Nawas, Insane 51, Bond Truluv) et les séries limitées Double A. Stock ultra-limité pour collectionneurs et passionnés d'art urbain."
                    backgroundImage="/classiques.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Collectors - Editions limitées" />

                <CategoryFAQ
                    items={FAQ_COLLECTOR}
                    subtitle="Art & Culture"
                    title="Le coin des collectionneurs"
                />
            </main>
        </div>
    );
}