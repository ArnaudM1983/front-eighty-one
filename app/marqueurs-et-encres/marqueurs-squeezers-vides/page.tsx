import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_VIDES = [
    {
        question: "Pourquoi acheter un marqueur ou un squeezer vide ?",
        answer: "Les outils vides comme le Montana Crusher ou le OTR 160 vous permettent de créer vos propres mélanges d'encres et de couleurs. C'est également une solution plus économique et écologique, car vous pouvez réutiliser le corps du marqueur de nombreuses fois en changeant simplement la pointe si nécessaire."
    },
    {
        question: "Quelle est la différence entre un Crusher et un Squeezer ?",
        answer: "Le 'Crusher' de Montana (disponible en 10mm et 18mm) et le 'Squeezer' de Best Ink sont des marqueurs à corps souple. En pressant le corps, vous contrôlez le débit de peinture pour créer des coulures (drips) maîtrisées. Les marqueurs à valve, comme le modèle biseau vide, nécessitent une pression sur la pointe pour laisser couler l'encre."
    },
    {
        question: "Quelle encre utiliser pour remplir mes marqueurs Best Ink ?",
        answer: "Pour les Squeezers et les marqueurs Barane Best Ink, privilégiez des encres fluides ou des peintures liquides comme la gamme OTR Paint ou Infamy. Évitez les peintures trop épaisses qui pourraient boucher la mèche. Pour un flux parfait, vous pouvez diluer légèrement votre peinture avec un solvant adapté."
    },
    {
        question: "Comment entretenir mon marqueur rechargeable pour qu'il dure ?",
        answer: "Après chaque remplissage, assurez-vous que le pas de vis est propre pour éviter que le bouchon ne se bloque. Si vous n'utilisez pas votre marqueur pendant longtemps, nettoyez la pointe avec un peu d'acétone ou de solvant pour éviter que la peinture ne sèche à l'intérieur de la mèche."
    }
];

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/marqueurs-squeezers-vides`,
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
    title: "Marqueurs Vides & Squeezers à Remplir : Montana, OTR, Best Ink | Eightyone Store",
    description: "Créez vos propres mélanges avec nos marqueurs et squeezers vides. Retrouvez les outils rechargeables Montana, On The Run (OTR) et Best Ink au meilleur prix à Lyon !"
};

export default async function VidesPage() {
    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Marqueurs & encres", href: "/marqueurs-et-encres" },
        { label: "Les marqueurs et squeezers vides" }
    ];

    const products = await getProducts();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": metadata.title,
          "description": metadata.description,
          "url": "https://www.eightyone-store.fr/marqueurs-et-encres/marqueurs-squeezers-vides",
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
          "mainEntity": FAQ_VIDES.map(item => ({
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
                    title="Marqueurs & Squeezers Vides à Remplir"
                    description="Économiques et entièrement personnalisables, nos marqueurs et squeezers vides sont les outils parfaits pour les artistes souhaitant créer leurs propres teintes. Retrouvez les références incontournables de chez Montana Cans, On The Run (OTR) et Best Ink. Faciles à remplir avec vos encres ou peintures fluides, ces corps de marqueurs rechargeables permettent de varier les pointes et les débits pour un rendu unique."
                    backgroundImage="/bandeau-marqueur-squeezer-vides.png"
                    scrollTargetId="productGrid"
                />

                <ProductGrid products={products} title="Les Marqueurs et Squeezers vides" />

                <CategoryFAQ 
                    items={FAQ_VIDES} 
                    subtitle="Customisation & Drips" 
                    title="Maîtriser les outils rechargeables"
                />
            </main>
        </div>
    );
}