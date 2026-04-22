import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_MINES = [
    {
        question: "Quand faut-il changer la mine de son marqueur ?",
        answer: "Il est temps de remplacer la mine lorsque celle-ci est trop écrasée, effilochée ou que la peinture a séché à l'intérieur, bloquant le débit. Changer la pointe (environ 2.00€ à 3.00€) permet de retrouver la précision d'un marqueur neuf sans avoir à racheter l'outil complet."
    },
    {
        question: "Les mines Uni sont-elles compatibles avec tous les feutres ?",
        answer: "Les mines Uni PC5M, PC8K ou PX30 sont spécifiquement conçues pour les modèles Posca et Uni Paint correspondants. Utiliser la bonne référence garantit une étanchéité parfaite et un pompage de la peinture fluide."
    },
    {
        question: "Quelle mine choisir pour un Squeezer Molotow ou Montana ?",
        answer: "Pour les Squeezers, les mines sont souvent en tissu haute résistance pour supporter les coulures sur surfaces rugueuses. Nous proposons des pointes de 10mm (Montana), ainsi que des formats 18mm et 25mm (Molotow) pour s'adapter à la largeur de votre outil."
    },
    {
        question: "Comment remplacer proprement une mine usagée ?",
        answer: "Utilisez une pince (ou un chiffon) pour tirer délicatement sur la mine usagée. Insérez la nouvelle mine dans le corps du marqueur, puis amorcez-la doucement en pompant sur une surface de test jusqu'à ce que l'encre imprègne totalement la nouvelle fibre."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/mines-de-rechange`,
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
    title: "Mines de Rechange & Pointes Montana, Uni Posca | Eightyone Store Lyon",
    description: "Remplacez vos pointes usées avec nos mines de rechange Montana, Uni Posca et Molotow. Toutes tailles disponibles pour marqueurs et squeezers à Lyon !"
};

export default async function MinesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les mines de rechange" }
    ];

    const products = await getProducts();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/marqueurs-et-encres/mines-de-rechange",
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
          "mainEntity": FAQ_MINES.map(item => ({
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
                    title="Mines de Rechange & Pointes"
                    description="Ne jetez plus vos marqueurs ! Prolongez la durée de vie de vos outils préférés avec nos mines de rechange. Que vous cherchiez des pointes de remplacement pour vos feutres Uni Posca ou des mines en fibre pour vos marqueurs Montana Cans, nous proposons toutes les tailles : extra-fines, rondes, biseautées ou XL. Idéal pour retrouver un tracé net et un débit d'encre fluide comme au premier jour."
                    backgroundImage="/bandeau-mines.png"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Mines de rechange" />

                <CategoryFAQ 
                    items={FAQ_MINES} 
                    subtitle="Entretien du matériel" 
                    title="Prolonger la vie de vos marqueurs"
                />
            </main>
        </div>
    );
}