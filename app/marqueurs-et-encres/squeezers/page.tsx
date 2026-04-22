import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_SQUEEZERS = [
    {
        question: "Quelle est la différence entre un OTR Superflow et un Soultip ?",
        answer: "Le Superflow (comme l'OTR 009 ou 012) est conçu pour un débit maximal et des coulures instantanées dès que l'on presse le corps du marqueur. Le Soultip (OTR 003, 005, 006) offre une pointe en mohair plus dense et résistante, permettant un meilleur contrôle du flux sur des surfaces variées."
    },
    {
        question: "Comment obtenir de belles coulures (drips) avec mon squeezer ?",
        answer: "Pour créer des drips maîtrisés, exercez une pression légère et constante sur le corps souple du marqueur tout en traçant votre lettrage. Plus vous pressez fort et ralentissez votre mouvement, plus les coulures seront longues. Les modèles OTR 009 (18mm) sont les favoris pour ce type d'effet."
    },
    {
        question: "Quelles sont les pointes disponibles pour les squeezers OTR ?",
        answer: "Nous proposons plusieurs tailles pour varier les styles : la pointe 6mm (OTR 006) pour la précision, la pointe 10mm (OTR 005, 012) pour la polyvalence, et la pointe large de 18mm (OTR 003, 009) pour un impact maximal et des tags massifs."
    },
    {
        question: "Les squeezers On The Run sont-ils rechargeables ?",
        answer: "Oui, tous nos squeezers OTR sont rechargeables. Une fois vide, il suffit de dévisser la tête (attention, le pas de vis est inversé sur certains modèles) pour faire le plein avec de la peinture OTR 901/902 ou de l'encre Hard to Buff. Pensez également à remplacer la pointe mohair lorsqu'elle est trop usée."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/squeezers`,
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
    title: "Squeezers Graffiti & Marqueurs Mop : OTR On The Run | Eightyone Store",
    description: "Réalisez des tags avec des coulures (drips) parfaites. Large choix de squeezers OTR Superflow et Soultip (6mm, 10mm, 18mm) au meilleur prix à Lyon !"
};

export default async function SqueezersPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les squeezers" }
    ];

    const products = await getProducts();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/marqueurs-et-encres/squeezers",
          "numberOfItems": products.length,
          "itemListElement": products.slice(0, 20).map((product: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": product.name,
              "url": `https://www.eightyone-store.fr/produit/${product.slug}`,
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
          "mainEntity": FAQ_SQUEEZERS.map(item => ({
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
                    title="Squeezers & Marqueurs Mops"
                    description="Indispensables pour un tag authentique, nos squeezers et mops sont conçus pour offrir des coulures (drips) maîtrisées et une opacité totale. Retrouvez les références On The Run (OTR) et Infamy. Dotés de pointes en mohair résistantes, ces marqueurs souples et rechargeables permettent de varier la pression pour un débit d'encre sur-mesure sur toutes les surfaces lisses."
                    backgroundImage="/squeezers.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Squeezers" />

                <CategoryFAQ 
                    items={FAQ_SQUEEZERS} 
                    subtitle="Drips & Coulures" 
                    title="Maîtriser l'art du Squeezer"
                />
            </main>
        </div>
    );
}