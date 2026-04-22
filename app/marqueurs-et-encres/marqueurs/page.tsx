import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

// FAQ optimisée pour les marqueurs (Montana Bold, OTR, Sakura, Uni Pin)
const FAQ_MARQUEURS = [
    {
        question: "Quelle est la particularité des marqueurs Montana BOLD ?",
        answer: "La gamme Montana BOLD (disponible en 8mm et 15mm à 8.50€) contient une encre 'ultra-ink' noire profonde, indélébile et extrêmement résistante aux UV et aux solvants. Sa pointe haute densité assure un débit régulier pour un marquage permanent sur presque toutes les surfaces."
    },
    {
        question: "Pourquoi utiliser un marqueur OTR (On The Run) ?",
        answer: "Les marqueurs OTR comme le 060 ou le 160 (pointes de 15mm) sont des classiques du graffiti. Ils sont rechargeables et leurs pointes sont remplaçables. Le modèle OTR Metal Tip (4.50€) est quant à lui idéal pour écrire sur des surfaces rugueuses, rouillées ou grasses grâce à sa pointe bille en acier."
    },
    {
        question: "C'est quoi un 'Solid Marker' comme le Sakura ?",
        answer: "Le Sakura Solid Marker (7.00€) est un marqueur de peinture solide sous forme de bâton. Il écrit sous l'eau, sur le gras, la rouille et même à travers la boue. Une fois sec, il est permanent et ne s'écaille pas, ce qui en fait l'outil ultime pour le marquage industriel ou urbain extrême."
    },
    {
        question: "Quels feutres choisir pour le dessin de précision ?",
        answer: "Pour les croquis, le noir de précision ou l'illustration, nous recommandons les stylos Uni Pin (2.90€). Ils utilisent une encre pigmentée résistante à l'eau et à la lumière, idéale pour tracer des contours nets qui ne bavent pas si vous repassez par-dessus avec des marqueurs à l'alcool."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/marqueurs`,
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
    title: "Marqueurs Peinture & Feutres Graffiti au Meilleur Prix | Eightyone Store",
    description: "Large choix de marqueurs : Montana Bold, On The Run (OTR), Sakura Solid et stylos Uni Pin. Pour le tag, la custom ou le dessin de précision à Lyon !"
};

export default async function MarqueursPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les marqueurs" }
    ];

    const products = await getProducts();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/marqueurs-et-encres/marqueurs",
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
          "mainEntity": FAQ_MARQUEURS.map(item => ({
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
                    title="Marqueurs Peinture & Feutres"
                    description="Découvrez notre sélection de marqueurs peinture et feutres de précision pour tous vos projets créatifs. Retrouvez différentes tailles de pointes (fines, larges, calligraphiques) pour écrire, tracer ou dessiner sur métal, verre, plastique, bois et papier."
                    backgroundImage="/home-marker.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Marqueurs" />

                <CategoryFAQ 
                    items={FAQ_MARQUEURS} 
                    subtitle="Outils de marquage" 
                    title="Choisir son marqueur ou feutre"
                />
            </main>
        </div>
    );
}