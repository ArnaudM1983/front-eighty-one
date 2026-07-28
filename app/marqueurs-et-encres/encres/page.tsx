import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

// FAQ optimisée pour les encres techniques (OTR, Infamy, Hard to Buff, etc.)
const FAQ_ENCRES = [
    {
        question: "Quelle est la différence entre l'encre OTR Paint et la Hard to Buff ?",
        answer: "L'OTR Paint (901/902) est une peinture épaisse et très couvrante, idéale pour les Squeezers et les surfaces sombres. La Hard to Buff (17.50€) est une encre à base d'alcool ultra-permanente et extrêmement difficile à effacer, conçue pour pénétrer le support en profondeur."
    },
    {
        question: "Pourquoi choisir les encres Infamy (Bat Shit, Vamp Black) ?",
        answer: "Les encres Infamy sont réputées pour leur fluidité et leur noirceur extrême. La Bat Shit (disponible en 250ml ou 1L) offre une brillance et une tenue record, tandis que la Vamp Black est une encre sombre parfaite pour recharger vos marqueurs à mèche."
    },
    {
        question: "C'est quoi une encre 'Tar Ink' ou 'Rust Ink' ?",
        answer: "Ce sont des encres techniques à effets. La Tar Ink (comme chez Mefians ou Infamy) imite l'aspect du goudron avec un rendu noir profond et épais. La Rust Ink simule un aspect rouillé une fois sèche, offrant une texture unique pour vos tags et créations artistiques."
    },
    {
        question: "Comment recharger proprement son marqueur ou squeezer ?",
        answer: "Utilisez un entonnoir ou le bec verseur fourni avec nos recharges OTR ou Infamy. Ne remplissez pas votre outil à ras bord pour éviter les fuites dues à la pression lors de l'utilisation. Pour les mélanges, veillez à ne pas mixer des encres à l'eau avec des encres à l'alcool."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/encres`,
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
    title: "Encres de Recharge pour Marqueurs & Squeezers | Eightyone Store Lyon",
    description: "Large choix d'encres permanentes : OTR Paint, Hard to Buff, Infamy Bat Shit, Mefians et Russian Roulette. Recharges pro pour graffiti à Lyon !"
};

export default async function EncresPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les encres" }
    ];

    const products = await getProducts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": metadata.title,
                "description": metadata.description,
                "url": "https://www.eightyonestore.com/marqueurs-et-encres/encres",
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
                "mainEntity": FAQ_ENCRES.map(item => ({
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
                    title="Encres de Recharge & Peintures Liquides"
                    description="Donnez une seconde vie à vos outils avec notre sélection d'encres de recharge professionnelles. Que vous cherchiez une encre à base d'alcool ultra-permanente, une peinture fluide pour squeezer ou une encre acrylique pour vos travaux d'arts graphiques, nous avons sélectionné les meilleures marques : On The Run, Infamy, Mefians Ink. Qualité testée pour une couvrance maximale et une résistance longue durée."
                    backgroundImage="/bandeau-encres.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Encres" />

                <CategoryFAQ
                    items={FAQ_ENCRES}
                    subtitle="Permanence & Flux"
                    title="Choisir sa recharge d'encre"
                />
            </main>
        </div>
    );
}