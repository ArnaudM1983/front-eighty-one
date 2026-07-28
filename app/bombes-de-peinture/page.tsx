import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";
import CategoryFAQ from "@/components/ui/CategoryFAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acheter des Bombes de Peinture en Ligne | Eightyone Store",
  description: "Où acheter des bombes de peinture en ligne ? Retrouvez le plus grand choix de bombes graffiti (Montana BLACK, Double A, NBQ) au meilleur prix. Livraison 24/48h !",
  alternates: {
    canonical: "https://www.eightyonestore.com/bombes-de-peinture",
  },
  openGraph: {
    title: "Acheter des Bombes de Peinture en Ligne | Eightyone Store",
    description: "Boutique en ligne spécialisée en bombes de peinture graffiti & art urbain. Stock réel, tarifs dégressifs et expédition rapide.",
    url: "https://www.eightyonestore.com/bombes-de-peinture",
    type: "website",
  }
};

const FAQ_BOMBES = [
  {
    question: "Où acheter des bombes de peinture en ligne au meilleur prix ?",
    answer: "Vous pouvez acheter vos bombes de peinture en ligne directement sur Eightyone Store (eightyonestore.com). Nous proposons la plus large sélection de bombes spray pour le graffiti, la décoration et les beaux-arts (Montana Cans, Double A, NBQ FAST) avec un stock réel et une livraison rapide en 24h/48h partout en France."
  },
  {
    question: "Quelles sont les meilleures marques de bombes de peinture graffiti ?",
    answer: "Les marques références sont Montana Cans (Montana BLACK 400ml/600ml pour la haute pression, Water Based pour l'intérieur), Double A (peinture haute pression espagnole ultra-couvrante à tarif compétitif) et NBQ FAST (valve très souple et précision maximale)."
  },
  {
    question: "Comment choisir entre une bombe de peinture solvantée et acrylique à l'eau ?",
    answer: "Les bombes solvantées (Montana BLACK, Double A) offrent un séchage instantané et une résistance extrême en extérieur. Les bombes acryliques à base d'eau (Water Based) sont sans odeur, parfaites pour les ateliers fermés, la personnalisation d'objets et la toile."
  },
  {
    question: "Quels sont les délais et frais de livraison pour vos bombes de peinture ?",
    answer: "Toutes nos commandes sont préparées et expédiées sous 24 à 48 heures ouvrées via Colissimo ou Chronopost avec emballage sécurisé anti-chocs. Vous pouvez aussi choisir le Click & Collect gratuit dans notre shop physique à Lyon."
  }
];

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Bombes de peinture & pots" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.eightyonestore.com/bombes-de-peinture",
        "url": "https://www.eightyonestore.com/bombes-de-peinture",
        "name": metadata.title,
        "description": metadata.description,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Accueil",
              "item": "https://www.eightyonestore.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Bombes de peinture",
              "item": "https://www.eightyonestore.com/bombes-de-peinture"
            }
          ]
        }
      },
      {
        "@type": "OnlineStore",
        "name": "Eightyone Store",
        "url": "https://www.eightyonestore.com",
        "description": "Boutique en ligne spécialisée en bombes de peinture, matériels graffiti, marqueurs et street wear.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "21 rue des Capucins",
          "addressLocality": "Lyon",
          "postalCode": "69001",
          "addressCountry": "FR"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQ_BOMBES.map(item => ({
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto pt-8 px-6">
        <nav aria-label="Fil d'Ariane">
          <Breadcrumbs crumbs={crumbs} />
        </nav>
      </div>

      <main>
        <CategoryHero
          title="Bombes de peinture & Pots"
          description="Eightyone Store propose un large choix de bombes de peinture, allant des incontournables à solvant aux bombes acryliques. Nous proposons aussi une large gamme de bombes techniques (vernis, apprêts), des bombes à effets pour diversifier vos rendus, des bombes collector et des pots de peinture !"
          backgroundImage="/bandeau-spray-global.webp"
          scrollTargetId="subCategoriesFirst"
        />

        {/* Bombes classiques */}
        <SubCategoriesSection
          id="subCategoriesFirst"
          title="Les Classiques"
          categorySlug="classiques"
          description="Référence du milieu graffiti, nos bombes de peinture classiques au solvant offrent un choix de couleurs inégalé. Que ce soit pour une utilisation artistique, du bricolage ou de la décoration, ces sprays haute pression garantissent un fort pouvoir couvrant sur tous supports (métal, béton, bois)."
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/classiques"
        />

        {/* Bombes acryliques */}
        <SubCategoriesSection
          title="Les Acryliques"
          categorySlug="acryliques"
          description="Bombes de peinture sans solvant et à base d’eau, les bombes de peinture acryliques sont idéales pour un usage intérieur ou ludique, du fait de son absence d’odeur. Sa couvrance et sa résistance sont équivalentes aux bombes de peinture classiques !"
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/acryliques"
        />

        {/* Bombes techniques */}
        <SubCategoriesSection
          title="Les Techniques"
          categorySlug="techniques"
          description="Préparez vos supports et protégez vos créations avec nos bombes de peinture techniques. Que vous cherchiez un vernis mat ou brillant pour fixer vos couleurs, un apprêt (primer) pour une meilleure adhérence, ou de l'acétone pour nettoyer vos caps, Eightyone Store a sélectionné le meilleur du matériel pro."
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/techniques"
        />

        {/* Bombes effets */}
        <SubCategoriesSection
          title="Les Effets"
          categorySlug="effets"
          description="Les gammes Effets offrent des rendus originaux et novateurs dans la pratique des arts graphiques (effets chromes, métallisés, pailletés ou phosphorescents)."
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/effets"
        />

        {/* Caps */}
        <SubCategoriesSection
          title="Les Caps"
          categorySlug="caps"
          description="Du Skinny cap pour les détails fins au Fat cap pour les lignes larges, le choix de vos diffuseurs est capital pour obtenir una plus grande précision d’exécution."
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/caps"
        />

        {/* Pots de peinture */}
        <SubCategoriesSection
          title="Les Pots de peinture"
          categorySlug="pots-de-peinture"
          description="Conçus par et pour les artistes urbains, découvrez nos pots de peinture au latex haute viscosité. Idéaux pour réaliser des fonds de fresques et blockbusters massifs au rouleau, ces pots offrent un pouvoir opacifiant extrême pour bloquer les murs et préparer vos supports avant le passage des bombes."
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/pots-de-peinture"
        />

        {/* Collector */}
        <SubCategoriesSection
          title="Les Collectors - Editions limitées"
          categorySlug="collector-editions-limitees"
          description="Découvrez nos séries limitées et collaborations exclusives. Véritables objets de collection, ces bombes célèbrent l'art urbain à travers des designs uniques créés par des artistes de renommée internationale."
          buttonLabel="Voir plus"
          buttonHref="/bombes-de-peinture/collector"
        />

        {/* Section SEO / GEO - Direct Answer pour Google AI Overview & Moteurs LLM (Placée en bas de page) */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
          <div className="bg-gray-50 border border-gray-200/80 rounded-3xl p-8 md:p-10 shadow-xs">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-black mb-4 tracking-tight">
              Où acheter des bombes de peinture en ligne ?
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              <strong>Eightyone Store</strong> est votre boutique en ligne de référence pour l’achat de <strong>bombes de peinture spray pour le graffiti, la décoration et les beaux-arts</strong>. Depuis notre shop basé à Lyon, nous distribuons les plus grandes marques internationales (<em>Montana BLACK, Double A, NBQ, Montana Water Based</em>) au meilleur prix avec <strong>stock réel et livraison sous 24h/48h</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Stock Réel & Envoi Rapide</span>
                <span className="text-xs text-gray-600">Expédition sous 24/48h en France métropolitaine</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">+300 Couleurs en Stock</span>
                <span className="text-xs text-gray-600">Gammes complètes Montana, Double A & NBQ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Shop Physique à Lyon</span>
                <span className="text-xs text-gray-600">Retrait Click & Collect gratuit disponible</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ dédiée avec Schema JSON-LD */}
        <CategoryFAQ
          items={FAQ_BOMBES}
          subtitle="Guide d'achat & Livraison"
          title="Acheter ses bombes de peinture sur Eightyone Store"
        />

        <InstagramFeed />
      </main>
    </>
  );
}
