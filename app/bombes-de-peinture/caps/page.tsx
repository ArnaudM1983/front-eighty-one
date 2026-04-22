import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_CAPS = [
    {
        question: "Comment choisir le bon cap pour ma bombe de peinture ?",
        answer: "Le choix dépend du rendu souhaité : utilisez un 'Skinny Cap' pour les traits fins et les détails (contour, lumière), un 'Fat Cap' pour les remplissages rapides et les gros traits (Astro Fat, Pink Fat), ou un cap calligraphique pour des effets de lettrages à plat."
    },
    {
        question: "Est-ce que tous les caps s'adaptent sur toutes les bombes ?",
        answer: "La plupart des bombes de graffiti modernes (Montana, Double-A, NBQ) utilisent un système de valve 'femelle', ce qui signifie que les caps ont une tige 'mâle'. Ils sont donc compatibles entre eux. Cependant, certaines bombes de bricolage ont des valves différentes qui nécessitent des adaptateurs."
    },
    {
        question: "Comment déboucher un cap de bombe aérosol ?",
        answer: "Si la peinture n'a pas encore durci, vous pouvez le tremper dans du solvant ou utiliser un nettoyeur de cap spécifique. Pour éviter qu'il ne se bouche, la règle d'or est de purger votre bombe après usage : retournez-la tête en bas et pulvérisez jusqu'à ce qu'il n'y ait plus que du gaz qui sorte."
    },
    {
        question: "Qu'est-ce que la valve 'Soft' ou 'Hard' ?",
        answer: "Ce n'est pas le cap mais la valve de la bombe qui définit la pression. Cependant, certains caps comme le 'Soft Cap' permettent de moduler le débit pour obtenir des dégradés plus doux, même sur des bombes à haute pression comme la Montana BLACK."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/caps`,
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
    title: "Caps pour Bombes de Peinture : Fat Caps, Skinny & Calligraphie | Eightyone Store",
    description: "Large choix de caps (diffuseurs) pour bombes de peinture. Fat caps pour le remplissage, Skinny pour les traits fins et caps calligraphiques. Stock pro à Lyon !"
};

export default async function CapsPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les caps" }
    ];

    const products = await getProducts();

    // --- DONNÉES STRUCTURÉES (ItemList + FAQPage) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/bombes-de-peinture/caps",
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
          "mainEntity": FAQ_CAPS.map(item => ({
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
                    title="Caps & Diffuseurs"
                    description="L'outil indispensable pour maîtriser votre débit. Du Skinny Cap pour un trait fin et précis aux Fat Caps pour des remplissages rapides et larges, découvrez notre sélection de buses pour bombes de peinture. Retrouvez les classiques : Fat, Astro Fat, New York Fat et bien d'autres pour varier vos effets."
                    backgroundImage="/caps.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Caps"/>

                <CategoryFAQ 
                    items={FAQ_CAPS} 
                    subtitle="Maîtrise du débit" 
                    title="Choisir ses diffuseurs graffiti"
                />
            </main>
        </div>
    );
}