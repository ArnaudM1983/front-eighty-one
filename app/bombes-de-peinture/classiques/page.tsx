import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import CategoryFAQ from "@/components/ui/CategoryFAQ";

const FAQ_CLASSIQUES = [
  {
    question: "Quelle est la différence entre la Montana BLACK et la Double A ?",
    answer: "La Montana BLACK est la référence nitro-alkyde haute pression, célèbre pour son séchage instantané et ses 144 teintes. La Double A (3.90€) offre une alternative ultra-compétitive avec 143 teintes et une valve très souple qui permet une excellente modulation du débit."
  },
  {
    question: "Pourquoi choisir la NBQ FAST ?",
    answer: "La NBQ FAST (4.20€) est conçue pour ceux qui recherchent une pression constante et une grande précision. C'est un excellent compromis entre la puissance d'une Montana BLACK et la souplesse nécessaire pour des lettrages techniques."
  },
  {
    question: "Quelles sont les bombes disponibles pour les gros remplissages ?",
    answer: "Pour couvrir de grandes surfaces rapidement, nous proposons la Montana BLACK 600mL (6.30€) et l'impressionnante Montana Ultra Wide (9.00€) pour des traits ultra-larges. Pour le chrome, la Silverchrome 600mL reste le standard du shop."
  },
  {
    question: "Existe-t-il des petits formats de bombes de peinture ?",
    answer: "Oui, pour les détails ou le transport discret, nous proposons la Montana BLACK en format 150mL (3.15€). C'est la même qualité de peinture nitro-alkyde que la 400mL, mais dans un format de poche."
  }
];

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/products/category/classiques`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export const metadata = {
  title: "Bombes de Peinture Graffiti : Montana BLACK, Double A & NBQ | Eightyone Store",
  description: "Le plus large choix de bombes haute pression à Lyon. Montana BLACK (4.50€), Double A (3.90€) et NBQ FAST. Plus de 300 nuances en stock réel !"
};

export default async function ClassiquesPage() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Bombes de peinture", href: "/bombes-de-peinture" },
    { label: "Les classiques" }
  ];

  const products = await getProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": metadata.title,
        "description": metadata.description,
        "url": "https://www.eightyonestore.com/bombes-de-peinture/classiques",
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 20).map((product: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "url": `https://www.eightyonestore.com/produit/${product.slug}`,
            "image": product.main_image || product.imageMain,
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
        "mainEntity": FAQ_CLASSIQUES.map(item => ({
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
          title="Bombes Classiques & Graffiti"
          description="Retrouvez les piliers du graffiti et de l'art urbain au shop. De l'incontournable Montana BLACK à la Double A au prix imbattable, nous avons sélectionné les meilleures bombes haute pression pour une couvrance mate et un séchage record. Plus de 300 teintes disponibles immédiatement à Lyon."
          backgroundImage="/classiques.webp"
          scrollTargetId="productGrid"
        />

        <ProductGrid products={products} title="Notre sélection Haute Pression" />

        <CategoryFAQ
          items={FAQ_CLASSIQUES}
          subtitle="Comparatif & Prix"
          title="Choisir sa bombe haute pression"
        />
      </main>
    </div>
  );
}