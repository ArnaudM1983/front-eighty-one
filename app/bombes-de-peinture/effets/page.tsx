import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_EFFETS = [
    {
        question: "Comment fonctionne la bombe Montana Marble Effect ?",
        answer: "La Montana Marble (10.00€) projette des filaments de peinture colorés qui imitent les veines du marbre. Pour un résultat optimal, appliquez-la par petites pressions à une distance de 30-40cm sur une base déjà peinte. Elle est idéale pour la déco, le design et les effets de texture en graffiti."
    },
    {
        question: "Quelle est la différence entre la Night Glow et la U.V Effect ?",
        answer: "La Montana Night Glow (16.00€) est phosphorescente : elle emmagasine la lumière le jour pour la restituer dans le noir total. La U.V Effect (10.00€), quant à elle, ne réagit qu'en présence d'une lumière noire (UV), ce qui la rend parfaite pour les scénographies de clubs ou d'événements nocturnes."
    },
    {
        question: "C'est quoi l'effet Montana Spider ?",
        answer: "La Montana Spider (4.20€) est une bombe de 150mL qui projette une toile d'araignée de peinture noire ou argentée. C'est un outil de calligraphie et de texture unique qui permet de créer des effets de relief et de projection organique très appréciés en street art."
    },
    {
        question: "Comment obtenir un bel effet craquelé avec la Montana Crackle ?",
        answer: "Pour que la Montana Crackle (12.00€) fonctionne, vous devez l'appliquer sur une base de peinture (Montana GOLD ou BLACK) qui n'est pas totalement sèche à cœur (entre 45 min et 24h après la pose). Plus la couche de Crackle est épaisse, plus les fissures seront larges."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/effets`,
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
    title: "Bombes de Peinture à Effets Spéciaux & Textures | Eightyone Store",
    description: "Sprays à effets Montana : Marble, Crackle, Night Glow, Spider et Granit. Transformez vos créations avec des finitions uniques au shop de Lyon !"
};

export default async function EffetsPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les effets" }
    ];

    const products = await getProducts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": metadata.title,
                "description": metadata.description,
                "url": "https://www.eightyonestore.com/bombes-de-peinture/effets",
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
                "mainEntity": FAQ_EFFETS.map(item => ({
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
                    title="Bombes de Peinture à Effets"
                    description="Donnez une dimension unique à vos projets. Marbre, toile d'araignée, craquelé ou phosphorescent : explorez notre gamme technique Montana Colors. Que ce soit pour du graffiti ou de la décoration d'objets, ces sprays offrent des finitions impossibles à obtenir au pinceau."
                    backgroundImage="/effets.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Effets Spéciaux" />

                <CategoryFAQ
                    items={FAQ_EFFETS}
                    subtitle="Techniques de décoration"
                    title="Maîtriser les bombes à effets"
                />
            </main>
        </div>
    );
}