import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

// Données FAQ pour le SEO des peintures Acryliques / Water Based
const FAQ_ACRYLIQUES = [
    {
        question: "Pourquoi choisir une bombe de peinture acrylique (Water Based) ?",
        answer: "La peinture acrylique à base d'eau est formulée sans solvants agressifs. Elle est quasiment inodore, ce qui la rend idéale pour peindre en intérieur, réaliser des ateliers avec des enfants ou travailler dans des espaces peu ventilés. Une fois sèche, elle est totalement indélébile et résistante aux UV."
    },
    {
        question: "Peut-on utiliser les bombes acryliques sur tous les supports ?",
        answer: "Oui, les bombes acryliques comme la gamme NBQ H2O adhèrent sur presque tout : toile, bois, métal, verre, polystyrène (qu'elles ne font pas fondre, contrairement aux bombes classiques) et même certains plastiques. C'est l'outil polyvalent par excellence pour les beaux-arts et la déco."
    },
    {
        question: "La peinture à l'eau est-elle moins résistante que la peinture solvantée ?",
        answer: "C'est une idée reçue ! Une fois que la résine acrylique a totalement polymérisé (environ 24h à 48h), elle offre une résistance comparable aux peintures classiques. Pour les objets soumis à de fortes manipulations, un vernis acrylique complémentaire est toutefois recommandé."
    },
    {
        question: "Comment nettoyer ses outils après avoir utilisé de l'acrylique en spray ?",
        answer: "Tant que la peinture est humide, vous pouvez nettoyer les éventuelles bavures avec de l'eau savonneuse. En revanche, une fois sèche, elle devient permanente. Pensez à purger votre cap (diffuseur) après usage en retournant la bombe pour éviter qu'il ne se bouche."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/acryliques`,
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
    title: "Bombes de Peinture Acrylique & Base Eau au Meilleur Prix | Eightyone Store",
    description: "Large choix de bombes de peinture acryliques sans solvant (Water Based). Idéales pour l'intérieur, les ateliers et les beaux-arts. Livraison France ou retrait à Lyon !"
};

export default async function AcryliquesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les acryliques" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (Graph pour coupler ItemList et FAQ) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/bombes-de-peinture/acryliques",
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
          "mainEntity": FAQ_ACRYLIQUES.map(item => ({
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
                    title="Bombes de Peinture Acryliques"
                    description="Parfaites pour un usage en intérieur, les bombes de peinture acryliques (Water Based) sont sans solvant et quasiment sans odeur. Idéales pour les ateliers avec enfants, les travaux de beaux-arts ou la décoration, ces sprays à base d'eau offrent une couvrance pro et une résistance durable sur tous supports une fois secs."
                    backgroundImage="/acryliques.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Acryliques"/>

                <CategoryFAQ 
                    items={FAQ_ACRYLIQUES} 
                    subtitle="Expertise" 
                    title="Tout savoir sur la peinture Water Based"
                />
            </main>
        </div>
    );
}