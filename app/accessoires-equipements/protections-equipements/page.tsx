import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

// Données FAQ pertinentes pour le SEO (Masques, Gants, Cellograff)
const FAQ_PROTECTIONS = [
    {
        question: "Quel masque choisir pour la peinture aérosol ?",
        answer: "Pour le graffiti, un masque avec filtres ABEP1 ou A2P3 est indispensable. Les masques 3M série 6000 ou 7000 protègent contre les vapeurs organiques des solvants et les particules fines de pigments. Ne peignez jamais sans protection respiratoire en intérieur ou dans des lieux mal ventilés."
    },
    {
        question: "Pourquoi utiliser des gants spécifiques pour le graffiti ?",
        answer: "Les gants Montana ou Molotow sont conçus pour offrir une sensibilité maximale au niveau du cap tout en étant résistants aux solvants. Ils évitent les brûlures dues au froid (gaz de la bombe) et gardent vos mains propres pour une session plus confortable."
    },
    {
        question: "Quel matériel pour faire du Cellograff ?",
        answer: "Le Cellograff nécessite du film étirable (cellophane) de haute résistance, souvent noir pour une meilleure opacité. Nous conseillons nos rouleaux larges de 50cm qui offrent une tension optimale entre deux poteaux ou arbres sans se déchirer sous la pression de la peinture."
    },
    {
        question: "Comment entretenir son masque de protection 3M ?",
        answer: "Après chaque session, retirez les filtres et nettoyez la pièce faciale avec de l'eau tiède et un savon doux. Rangez votre masque dans un sac hermétique pour prolonger la durée de vie des filtres à charbon actif, qui s'usent au contact de l'air."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/protections-equipements`,
        {
            method: "GET",
            cache: "no-store",
        }
    );
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return res.json();
}

export const metadata = {
    title: "Protections Graffiti & Équipement : Masques 3M, Gants & Cellograff | Eightyone Store",
    description: "Équipez-vous pour peindre en toute sécurité : masques 3M, gants Montana, sacs de transport et cellophane noir pour le Cellograff. Stock pro disponible à Lyon !"
};

export default async function ProtectionsPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Accessoires & équipements", href: "/accessoires-equipements" },
        { label: "Les protections & équipements" }
    ];

    const products = await getProducts();

    // Mise à jour du JSON-LD pour inclure la FAQ (très bon pour les rich snippets Google)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": metadata.title,
                "description": metadata.description,
                "url": "https://www.eightyone-store.fr/accessoires-equipements/protections-equipements",
                "numberOfItems": products.length,
                "itemListElement": products.slice(0, 20).map((product: any, index: number) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": product.name,
                        "image": product.main_image,
                        "offers": {
                            "@type": "Offer",
                            "price": product.price,
                            "priceCurrency": "EUR"
                        }
                    }
                }))
            },
            {
                "@type": "FAQPage",
                "mainEntity": FAQ_PROTECTIONS.map(item => ({
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
                    title="Protections & Équipements"
                    description="Pratiquez le graffiti et les arts urbains en toute sécurité. Protégez votre santé avec nos masques 3M anti-vapeurs toxiques et nos gants. Retrouvez également le nécessaire pour le Cellograff et la logistique."
                    backgroundImage="/accessoires.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Protections & équipements" />

                <CategoryFAQ
                    items={FAQ_PROTECTIONS}
                    subtitle="FAQ Technique"
                    title="Les questions posées au shop de Lyon"
                />
                
            </main>
        </div>
    );
}