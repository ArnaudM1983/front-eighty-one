import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";
import CategoryFAQ from "@/components/ui/CategoryFAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acheter des Marqueurs Graffiti, Squeezers & Encres | Eightyone Store",
  description: "Où acheter des marqueurs graffiti, squeezers et encres en ligne ? Retrouvez Posca, Uni Paint, Grog, OTR, Montana au meilleur prix. Livraison 24/48h !",
  alternates: {
    canonical: "https://www.eightyonestore.com/marqueurs-et-encres",
  },
  openGraph: {
    title: "Acheter des Marqueurs Graffiti, Squeezers & Encres | Eightyone Store",
    description: "Boutique en ligne spécialisée en marqueurs graffiti, feutres peinture, squeezers et encres. Stock réel et expédition rapide.",
    url: "https://www.eightyonestore.com/marqueurs-et-encres",
    type: "website",
  }
};

const FAQ_MARQUEURS_ENCRES = [
  {
    question: "Où acheter des marqueurs graffiti, squeezers et encres en ligne ?",
    answer: "Vous pouvez acheter vos marqueurs graffiti, squeezers, feutres peinture (Posca, Uni Paint) et recharges d'encre directement sur Eightyone Store (eightyonestore.com). Nous proposons la meilleure sélection d'outils de marquage pour le tag, le dessin et la customisation avec stock réel et livraison sous 24h/48h partout en France."
  },
  {
    question: "Quelles sont les meilleures marques de marqueurs pour le tag et le dessin ?",
    answer: "Les marques références disponibles au shop sont Uni Paint (marqueurs PX-30 et PX-20 à peinture à l'huile indélébile), Posca (feutres peinture à l'eau pour illustrations et custom), Grog (squeezers & encres Buff Proof Ink), On The Run (OTR), Montana Cans et Molotow."
  },
  {
    question: "Quelle est la différence entre un marqueur à valve, un squeezer et un feutre peinture ?",
    answer: "Un marqueur à valve (ex: Uni Paint, Posca) libère la peinture par pression sur la pointe pour obtenir un trait net et régulier. Un squeezer possède un corps souple que l'on presse pour contrôler le débit d'encre et créer des coulures (drips). Les feutres peinture s'utilisent sur tous supports (toile, bois, métal, textile)."
  },
  {
    question: "Proposez-vous des marqueurs vides et des recharges d'encre ?",
    answer: "Oui, Eightyone Store propose une gamme complète de marqueurs et squeezers vides à personnaliser soi-même, ainsi que des recharges d'encre permanente (base alcool ou peinture) et des mines de rechange de toutes tailles pour prolonger la durée de vie de votre matériel."
  }
];

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Marqueurs & encres" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.eightyonestore.com/marqueurs-et-encres",
        "url": "https://www.eightyonestore.com/marqueurs-et-encres",
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
              "name": "Marqueurs & encres",
              "item": "https://www.eightyonestore.com/marqueurs-et-encres"
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
        "mainEntity": FAQ_MARQUEURS_ENCRES.map(item => ({
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
          title="Marqueurs & encres"
          description="Large choix disponible, du marqueur au squeezer, qu’il soit plein ou vide, de différentes tailles et diamètres . Vous trouverez aussi les encres adaptées au remplissage, toutes testées par nos soins et approuvées pour leur résistance et leurs qualités !"
          backgroundImage="/bandeau-encres.png"
          scrollTargetId="subCategoriesFirst"
        />

        {/* Les encres */}
        <SubCategoriesSection
          id="subCategoriesFirst"
          title="Les Encres"
          categorySlug="encres"
          description="De la pratique des arts graphiques à la pratique du tag pur et dur, notre selection d’encre vous offres ce qu’il y a de meilleurs sur le marché actuel. En êtant nous même passionés, nous testons et selectionnons seulement le meilleur et le plus efficace pour vous."
          buttonLabel="Voir plus"
          buttonHref="/marqueurs-et-encres/encres"
        />

        {/* Les squeezers */}
        <SubCategoriesSection
          title="Les Squeezers"
          categorySlug="squeezers"
          description="Permettant de faire des tags ou des traçés rond et coulant, le squeezer est vite passé de l’effet de mode à un incontournable pour tout les graffeurs du monde entier."
          buttonLabel="Voir plus"
          buttonHref="/marqueurs-et-encres/squeezers"
        />

        {/* Les marqueurs */}
        <SubCategoriesSection
          title="Les Marqueurs"
          categorySlug="marqueurs"
          description="Cette sélection de marqueurs déjà remplis vous permettra de traçer, écrire et plus sur tout types de surfaces, quelques soit vos besoins."
          buttonLabel="Voir plus"
          buttonHref="/marqueurs-et-encres/marqueurs"
        />

        {/* Les mines de rechange */}
        <SubCategoriesSection
          title="Les Mines de rechange"
          categorySlug="mines-de-rechange"
          description="Indispensables pour assurer une plus grande durée de vie à son marqueur ou squeezer préferé, vous trouverez ici toutes les tailles de mines de rechanges pour repartir avec un marqueur comme neuf !"
          buttonLabel="Voir plus"
          buttonHref="/marqueurs-et-encres/mines-de-rechange"
        />

        {/* Les marqueurs & squeezers vides */}
        <SubCategoriesSection
          title="Les marqueurs & squeezers vides"
          categorySlug="marqueurs-squeezers-vides"
          description="Faciles à remplir et de très bonne qualité, notre séléction de squeezers vides vous offres ce qu’il se fait de mieux sur le marché."
          buttonLabel="Voir plus"
          buttonHref="/marqueurs-et-encres/marqueurs-squeezers-vides"
        />

        {/* Les Posca & Uni Paint */}
        <SubCategoriesSection
          title="Les Posca & Uni Paint"
          categorySlug="posca-uni-paint"
          description="Référence mondiale du dessin et de la personnalisation, les marqueurs Posca à base d’eau et les Uni Paint à base d'huile sont indispensables pour vos créations. Que ce soit pour dessiner sur textile, customiser des baskets, peindre sur bois, métal ou verre, ces feutres de peinture permanents offrent une opacité exceptionnelle et une résistance aux UV."
          buttonLabel="Voir plus"
          buttonHref="/marqueurs-et-encres/posca-uni-paint"
        />

        {/* Section SEO / GEO - Direct Answer pour Google AI Overview & Moteurs LLM (Placée en bas de page) */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
          <div className="bg-gray-50 border border-gray-200/80 rounded-3xl p-8 md:p-10 shadow-xs">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-black mb-4 tracking-tight">
              Où acheter des marqueurs graffiti et encres en ligne ?
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              <strong>Eightyone Store</strong> est votre shop spécialisé pour l’achat de <strong>marqueurs graffiti, squeezers, feutres peinture (Posca, Uni Paint) et recharges d'encre</strong>. Retrouvez en ligne et dans notre magasin à Lyon les meilleurs outils de marquage pour le tag, le custom et le dessin avec <strong>stock réel et expédition sous 24h/48h</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Stock Réel & Envoi Rapide</span>
                <span className="text-xs text-gray-600">Expédition sous 24/48h partout en France</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Posca, Uni Paint, Grog & OTR</span>
                <span className="text-xs text-gray-600">Sélection testée et approuvée par le shop</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Shop Physique à Lyon</span>
                <span className="text-xs text-gray-600">Retrait Click & Collect disponible en magasin</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ dédiée avec Schema JSON-LD */}
        <CategoryFAQ
          items={FAQ_MARQUEURS_ENCRES}
          subtitle="Guide d'achat & Matériel"
          title="Acheter ses marqueurs et encres sur Eightyone Store"
        />

        <InstagramFeed />
      </main>
    </>
  );
}
