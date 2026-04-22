import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_TECHNIQUES = [
    {
        question: "Pourquoi appliquer un vernis Montana sur ma peinture ?",
        answer: "L'application d'un vernis (9.00€) est essentielle pour protéger votre création des rayons UV, des intempéries et des rayures. Le vernis Brillant ravive les couleurs et apporte de l'éclat, tandis que le vernis Mat supprime les reflets pour un rendu sobre et professionnel."
    },
    {
        question: "Quelle est la différence entre l'Acétone et le Remover Montana ?",
        answer: "L'Acétone Montana (10.00€) est principalement utilisée comme nettoyant universel pour déboucher les caps ou nettoyer des résidus de peinture fraîche sur les outils. Le Montana Remover (12.00€) est une formule plus puissante conçue pour décaper et dissoudre la peinture déjà sèche sur de nombreuses surfaces."
    },
    {
        question: "Comment bien utiliser le vernis en spray sans faire de traces ?",
        answer: "Appliquez le vernis en couches très fines et croisées à une distance de 25cm. Il vaut mieux passer deux ou trois voiles légers qu'une seule couche épaisse qui risquerait de couler ou de créer un voile trouble (blanchiment)."
    },
    {
        question: "Puis-je utiliser l'Acétone Montana pour nettoyer mes caps ?",
        answer: "Oui, c'est l'usage principal au shop. En pulvérisant un peu d'acétone à travers un cap bouché ou en les laissant tremper dans un récipient, vous prolongez considérablement la durée de vie de vos diffuseurs."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/techniques`,
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
    title: "Bombes Techniques : Vernis, Apprêts & Nettoyage | Eightyone Store",
    description: "Protégez vos œuvres avec nos vernis Montana Brillant ou Mat. Solutions de nettoyage : Acétone et Remover disponibles au shop de Lyon."
};

export default async function TechniquesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Bombes de peinture", href: "/bombes-de-peinture" },
        { label: "Les techniques" }
    ];

    const products = await getProducts();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/bombes-de-peinture/techniques",
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
          "mainEntity": FAQ_TECHNIQUES.map(item => ({
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
                    title="Bombes Techniques & Préparation"
                    description="Indispensables pour la finition ou la préparation de vos supports, nos bombes techniques garantissent un rendu professionnel et durable. Retrouvez nos vernis de protection (mat, satiné, brillant), nos apprêts (primers) pour tous types de surfaces, ainsi que des solutions de nettoyage comme l'acétone pour l'entretien de vos caps et de votre matériel."
                    backgroundImage="/techniques.webp"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Préparation & Finition" />

                <CategoryFAQ 
                    items={FAQ_TECHNIQUES} 
                    subtitle="Entretien & Protection" 
                    title="L'avis de l'expert technique"
                />
            </main>
        </div>
    );
}