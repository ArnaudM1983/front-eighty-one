import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

// Données FAQ pour le SEO des pots de peinture
const FAQ_POTS_PEINTURE = [
    {
        question: "Pourquoi choisir la peinture Double A Supreme Latex plutôt qu'une peinture classique ?",
        answer: "La Supreme Latex est formulée spécifiquement pour le street art et les fresques grand format. Contrairement aux peintures de bâtiment classiques, elle offre un pouvoir opacifiant extrême qui bloque les anciens tags en une seule couche, tout en offrant une élasticité supérieure qui évite les craquelures à l'extérieur."
    },
    {
        question: "Peut-on utiliser la peinture Supreme Latex sur tous les supports ?",
        answer: "Oui, sa haute viscosité et sa texture épaisse sont conçues pour adhérer et combler les irrégularités des supports difficiles et poreux : béton brut, parpaing, brique et façades extérieures. C'est le produit idéal pour préparer un mur propre et net avant de passer aux lettrages."
    },
    {
        question: "La peinture au latex aqueux est-elle résistante pour les blockbusters en extérieur ?",
        answer: "Absolument. La technologie de latex aqueux crée un film ultra-adhérent et une membrane élastique qui laisse respirer le support. Elle résiste parfaitement aux chocs thermiques, aux intempéries et au gel, évitant ainsi que votre fond ne s'écaille avec le temps."
    },
    {
        question: "Comment appliquer la peinture et nettoyer les outils après usage ?",
        answer: "Elle s'applique facilement au rouleau à poils longs (12 à 14 mm) ou au pinceau brosse pour les angles. Tant que la peinture est humide, les outils se nettoient simplement à l'eau tiède. Une fois sèche (comptez 4h à 20°C), elle devient totalement permanente et étanche."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/pots-de-peinture`,
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
    title: "Pots de Peinture Acrylique au Meilleur Prix | Eightyone Store",
    description: "Les pots de peinture ultimes pour vos fonds et blockbusters au rouleau. Opacité extrême, anti-craquelures. En stock à Lyon & livraison 24/48h !"
};

export default async function PotsPeinturePage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les pots de peinture" }
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
          "url": "https://www.eightyone-store.fr/bombes-de-peinture/pots-de-peinture",
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
          "mainEntity": FAQ_POTS_PEINTURE.map(item => ({
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
                    title="Pots de peinture"
                    description="Conçus par et pour les artistes urbains, découvrez nos pots de peinture au latex haute viscosité. Idéaux pour réaliser des fonds de fresques et blockbusters massifs au rouleau, ces pots offrent un pouvoir opacifiant extrême pour bloquer les murs et préparer vos supports avant le passage des bombes."
                    backgroundImage="/latex.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Pots de peinture"/>

                <CategoryFAQ 
                    items={FAQ_POTS_PEINTURE} 
                    subtitle="Expertise" 
                    title="Tout savoir sur les pots de peinture"
                />
            </main>
        </div>
    );
}