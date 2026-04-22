import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_POSCA_UNI = [
    {
        question: "Quelle est la différence entre un Posca et un Uni Paint PX ?",
        answer: "Le Posca est un marqueur à base d'eau et de pigments acryliques, idéal pour le dessin, le textile et la customisation éphémère ou protégée. Le Uni Paint (PX-20 et PX-30) est un marqueur de peinture à base d'huile, extrêmement permanent, qui résiste à l'eau, à la chaleur et aux intempéries, même sur des surfaces industrielles."
    },
    {
        question: "Comment fixer la peinture Posca sur différents supports ?",
        answer: "Bien que permanent sur les surfaces poreuses (bois, carton), il est conseillé de fixer le Posca sur les surfaces lisses : passez au four pour la céramique ou le verre (30 min à 160°C), repassez à l'envers pour le textile, ou appliquez un vernis en spray pour le plastique et le métal."
    },
    {
        question: "Quelles sont les pointes les plus utilisées chez Posca ?",
        answer: "Le PC-5M (6.00€) est le plus polyvalent avec sa pointe ronde moyenne. Pour les détails, le PC-1MR (4.20€) est parfait. Si vous travaillez sur de grandes surfaces ou des lettrages épais, privilégiez le PC-8K (7.50€) avec sa pointe large biseautée."
    },
    {
        question: "Le Uni Paint PX-30 est-il vraiment indélébile ?",
        answer: "Oui, le PX-30 (8.00€) est une référence mondiale pour son encre à base d'huile ultra-adhérente. Il est quasiment impossible à effacer une fois sec, ce qui en fait l'outil préféré des graffeurs pour les tags en extérieur et des professionnels pour le marquage de métaux ou de pneus."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/posca-uni-paint`,
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
    title: "Marqueurs Posca & Uni Paint au Meilleur Prix | Eightyone Store Lyon",
    description: "Toute la gamme Posca (PC-3M, 5M, 8K) et Uni Paint (PX-20, PX-30) en stock. Feutres peinture pour dessin, textile et custom à Lyon !"
};

export default async function PoscaUniPaintPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les Posca & Uni Paint" }
    ];

    const products = await getProducts();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/marqueurs-et-encres/posca-uni-paint",
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
          "mainEntity": FAQ_POSCA_UNI.map(item => ({
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
                    title="Marqueurs Posca & Uni Paint"
                    description="Références mondiales de la customisation et du dessin pro, les marqueurs Posca (base eau) et Uni Paint (base huile) s'adaptent à toutes vos envies créatives. Que ce soit pour dessiner sur textile, personnaliser des baskets, peindre sur bois, métal ou verre, ces feutres de peinture permanents offrent une opacité exceptionnelle. Retrouvez toutes les tailles de pointes, du PC-1MR au PC-8K, ainsi que les mythiques Uni Paint PX-20 et PX-30."
                    backgroundImage="/bandeau-poscaunipaint.png"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Posca & Uni Paint" />

                <CategoryFAQ 
                    items={FAQ_POSCA_UNI} 
                    subtitle="Custom & Précision" 
                    title="Tout savoir sur les feutres peinture Uni"
                />
            </main>
        </div>
    );
}