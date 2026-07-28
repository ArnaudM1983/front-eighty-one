import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const STICKERS_FAQ = [
    {
        question: "C'est quoi un sticker Eggshell ?",
        answer: "Les stickers Eggshell (coquille d'œuf) tirent leur nom de leur fragilité une fois posés : ils se brisent en petits morceaux si l'on tente de les décoller. Cette particularité les rend quasiment impossibles à retirer d'un trait, garantissant une longévité maximale à vos tags et créations en extérieur."
    },
    {
        question: "Quels marqueurs utiliser sur les stickers vierges ?",
        answer: "Pour une customisation précise et colorée, les marqueurs POSCA (acrylique) sont parfaits sur les stickers papier. Si vous cherchez une résistance maximale aux intempéries sur des Eggshells, privilégiez les marqueurs de peinture permanente Montana ou les indélébiles On The Run (OTR). Pour des tracés fins et noirs ultra-résistants, les feutres Uni-Ball restent une valeur sûre."
    },
    {
        question: "Les stickers Montana Cans résistent-ils à la pluie ?",
        answer: "Oui, les stickers officiels Montana Cans et nos gammes vinyles sont traités pour résister aux conditions climatiques difficiles et aux rayons UV. Ils ne déteignent pas et ne se décollent pas sous l'effet de l'humidité une fois que l'adhésif a bien polymérisé sur le support."
    },
    {
        question: "Sur quelles surfaces peut-on coller des stickers graffiti ?",
        answer: "Pour une adhérence optimale, privilégiez les surfaces lisses, propres et sèches (métal, verre, plastique, peinture propre). Sur les surfaces poreuses comme le béton brut ou la brique, l'adhérence sera moindre, sauf pour les Eggshells qui épousent mieux les irrégularités du support."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/stickers-book`,
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
    title: "Stickers Graffiti & Eggshells Montana Cans | Eightyone Store Lyon",
    description: "Large choix de stickers graffiti : Eggshell indestructibles, Hello My Name Is et stickers Montana Cans. Haute résistance aux intempéries et UV à Lyon !"
};

export default async function StickersPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les stickers" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (JSON-LD) ---
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": metadata.title,
                "description": metadata.description,
                "url": "https://www.eightyonestore.com/accessoires-equipements/stickers-book",
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
                "mainEntity": STICKERS_FAQ.map(item => ({
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
                    title="Stickers Graffiti & Eggshells"
                    description="Support incontournable du Street Art, découvrez notre sélection de stickers vierges et collectors. Retrouvez les célèbres stickers Montana Cans et les Eggshells indestructibles, conçus pour une adhérence extrême sur toutes les surfaces urbaines."
                    backgroundImage="/stickers.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Stickers Graffiti" />

                <CategoryFAQ
                    items={STICKERS_FAQ}
                    subtitle="Culture & Support"
                    title="Tout savoir sur les stickers"
                />
            </main>
        </div>
    );
}