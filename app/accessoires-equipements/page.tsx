import SubCategoriesSection from "@/components/sections/SubCategories";
import CategoryHero from "@/components/sections/CategoryHero";
import Breadcrumbs from "@/components/ui/Breadcrumb";
import InstagramFeed from "@/components/sections/InstagramFeed";
import CategoryFAQ from "@/components/ui/CategoryFAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acheter des Accessoires Graffiti, Masques & Blackbooks | Eightyone Store",
  description: "Où acheter des accessoires et équipements graffiti en ligne ? Masques de protection à cartouches, gants, stickers eggshell, blackbooks et livres d'art au meilleur prix. Livraison 24/48h !",
  alternates: {
    canonical: "https://www.eightyonestore.com/accessoires-equipements",
  },
  openGraph: {
    title: "Acheter des Accessoires Graffiti, Masques & Blackbooks | Eightyone Store",
    description: "Équipez-vous pour vos sessions graffiti : masques de protection A1P3, gants, stickers eggshell et blackbooks. Stock réel et livraison rapide.",
    url: "https://www.eightyonestore.com/accessoires-equipements",
    type: "website",
  }
};

const FAQ_ACCESSOIRES = [
  {
    question: "Où acheter des accessoires et équipements de protection graffiti en ligne ?",
    answer: "Vous pouvez acheter vos équipements et accessoires graffiti directement en ligne sur Eightyone Store (eightyonestore.com). Nous proposons des masques de protection à cartouches (A1P3/A2P3), gants de protection, stickers eggshell, blackbooks et carnets de croquis avec expédition rapide sous 24h/48h partout en France."
  },
  {
    question: "Quel masque de protection choisir pour peindre à la bombe de peinture ?",
    answer: "Pour peindre à la bombe solvantée en toute sécurité, il est indispensable d'utiliser un masque respiratoire demi-masque réutilisable équipé de filtres combinés gaz/vapeurs organiques et particules (normes A1P3 ou A2P3), comme la gamme disponible sur Eightyone Store."
  },
  {
    question: "Quels types de blackbooks et carnets de croquis sont recommandés pour les marqueurs ?",
    answer: "Pour dessiner avec des marqueurs à l'alcool ou à l'eau sans traverser le papier, privilégiez les blackbooks et carnets à papier épais (180g à 250g) ou papier Layout spécial feutre, disponibles dans notre rayon spécialisé."
  },
  {
    question: "Proposez-vous des stickers graffiti et papier eggshell ?",
    answer: "Oui, Eightyone Store propose une sélection de stickers personnalisables et d'autocollants ultra-résistants (eggshell, vinyle) parfaitement adaptés à l'écriture au marqueur permanent et au tag."
  }
];

export default async function Page() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Accessoires & équipements" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.eightyonestore.com/accessoires-equipements",
        "url": "https://www.eightyonestore.com/accessoires-equipements",
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
              "name": "Accessoires & équipements",
              "item": "https://www.eightyonestore.com/accessoires-equipements"
            }
          ]
        }
      },
      {
        "@type": "OnlineStore",
        "name": "Eightyone Store",
        "url": "https://www.eightyonestore.com",
        "description": "Boutique en ligne spécialisée en bombes de peinture, matériels graffiti, marqueurs, équipements et street wear.",
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
        "mainEntity": FAQ_ACCESSOIRES.map(item => ({
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
          title="Accessoires & équipements"
          description="Des outils complémentaires et parfois indispensables à la bonne pratique de votre passion : masques de protection, gants, stickers et blackbooks."
          backgroundImage="/accessoires.webp"
          scrollTargetId="subCategoriesFirst"
        />

        {/* Protections & équipements */}
        <SubCategoriesSection
          id="subCategoriesFirst"
          title="Protections & équipements"
          categorySlug="protections-equipements"
          description="Protégez vos voies respiratoires et vos mains lors de vos sessions de peinture. Notre sélection de masques à cartouches et gants vous garantit une sécurité optimale lors de l'utilisation de sprays et solvants."
          buttonLabel="Voir plus"
          buttonHref="/accessoires-equipements/protections-equipements"
        />

        {/* Stickers & books */}
        <SubCategoriesSection
          title="Stickers & book"
          categorySlug="stickers-book"
          description="Idéal pour gagner en visibilité, les stickers vous offrent un support adapté et durable pour l’utilisation des marqueurs. Les carnets (blackbooks), quant à eux, sont des indispensables pour l’entraînement (sketching) et la conservation de vos visuels."
          buttonLabel="Voir plus"
          buttonHref="/accessoires-equipements/stickers-book"
        />

        {/* Livres & Magasines */}
        <SubCategoriesSection
          title="Books & Magazines"
          categorySlug="books"
          description="Découvrez notre sélection de livres d'art urbain, monographies et magazines consacrés à la culture graffiti et au street art."
          buttonLabel="Voir plus"
          buttonHref="/accessoires-equipements/books"
        />

        {/* Section SEO / GEO - Direct Answer pour Google AI Overview & Moteurs LLM (Placée en bas de page) */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
          <div className="bg-gray-50 border border-gray-200/80 rounded-3xl p-8 md:p-10 shadow-xs">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-black mb-4 tracking-tight">
              Où acheter des accessoires et équipements graffiti en ligne ?
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              <strong>Eightyone Store</strong> est votre boutique spécialisée pour l’achat d’<strong>accessoires graffiti et équipements de protection</strong>. Retrouvez en ligne et dans notre shop à Lyon vos <strong>masques respiratoires à cartouches, gants, stickers eggshell, blackbooks et livres d'art urbain</strong> au meilleur prix avec <strong>stock réel et expédition en 24h/48h</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Stock Réel & Envoi Rapide</span>
                <span className="text-xs text-gray-600">Expédition sous 24/48h partout en France</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black text-sm uppercase tracking-wide mb-1">Protections Homologuées</span>
                <span className="text-xs text-gray-600">Masques A1P3, gants & matériel de sécurité pro</span>
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
          items={FAQ_ACCESSOIRES}
          subtitle="Guide d'équipement & Sécurité"
          title="Choisir ses accessoires et protections graffiti"
        />

        <InstagramFeed />
      </main>
    </>
  );
}
