import type { Metadata } from "next";
import BestSellers from "@/components/sections/BestSellers";
import { Categories } from "@/components/sections/Categories";
import GoogleReviews from "@/components/sections/GoogleReviews";
import Hero from "@/components/sections/Hero";
import InstagramFeed from "@/components/sections/InstagramFeed";
import HomeSEOContent from "@/components/sections/HomeSEOContent";
import HomeGuidesSection from "@/components/sections/HomeGuidesSection";

export const metadata: Metadata = {
  title: "Eightyone Store | Bombes de Peinture Graffiti & Arts à Lyon et en Ligne",
  description:
    "Le spécialiste graffiti à Lyon depuis 2008. Vente de bombes Montana, Double-A, NBQ, marqueurs Posca, Uni Paint, squeezers et encres. Livraison 24/48h ou retrait shop à Lyon !",
  alternates: {
    canonical: "https://www.eightyonestore.com",
  },
  openGraph: {
    title: "Eightyone Store | Bombes de Peinture Graffiti & Arts à Lyon et en Ligne",
    description: "Le spécialiste graffiti & street art depuis 2008. Vente de bombes de peinture, marqueurs, encres et vêtements urbains.",
    url: "https://www.eightyonestore.com",
    type: "website",
  }
};

const FAQ_HOME = [
  {
    question: "Où acheter des bombes de peinture et du matériel graffiti en ligne ?",
    answer: "Vous pouvez acheter vos bombes de peinture (Montana BLACK, Double A, NBQ), marqueurs (Posca, Uni Paint), squeezers et encres sur la boutique en ligne Eightyone Store (eightyonestore.com) ou directement au shop physique au 21 Rue des Capucins (69001 Lyon). Expédition rapide sous 24h/48h partout en France."
  },
  {
    question: "Où se situe le magasin physique Eightyone Store à Lyon ?",
    answer: "Le shop physique Eightyone Store est situé au 21 Rue des Capucins, 69001 Lyon (Pentes de la Croix-Rousse). La boutique est ouverte du lundi au samedi de 11h à 19h pour l'achat direct et le retrait Click & Collect."
  },
  {
    question: "Quelles marques de spray graffiti et marqueurs sont disponibles chez Eightyone Store ?",
    answer: "Eightyone Store distribue les plus grandes marques d'art urbain : Montana Cans (Montana BLACK, Gold, Water Based, Tech), Double A, NBQ FAST, Posca, Uni Paint (PX-30 / PX-20), Grog, On The Run (OTR) et Molotow."
  },
  {
    question: "Quels sont les délais de livraison pour les commandes en France ?",
    answer: "Toutes nos commandes sont préparées et expédiées sous 24h à 48h ouvrées via Colissimo ou Chronopost avec emballage sécurisé anti-chocs dans toute la France métropolitaine."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": "https://www.eightyonestore.com/#organization",
        "name": "Eightyone Store",
        "url": "https://www.eightyonestore.com",
        "logo": "https://www.eightyonestore.com/logo-81.png",
        "image": "https://www.eightyonestore.com/store-front.webp",
        "description": "Le spécialiste graffiti à Lyon depuis 2008. Vente de bombes de peinture (Montana, Double-A, NBQ), marqueurs, encres et matériel d'art.",
        "telephone": "+33478911852",
        "priceRange": "€€",
        "currenciesAccepted": "EUR",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "21 Rue des Capucins",
          "addressLocality": "Lyon",
          "postalCode": "69001",
          "addressCountry": "FR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 45.7694,
          "longitude": 4.8345
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "11:00",
            "closes": "19:00"
          }
        ],
        "sameAs": [
          "https://www.instagram.com/81store/",
          "https://www.facebook.com/eighty-one-store",
          "https://maps.app.goo.gl/pXLeBiCaUixvJLJn9"
        ],
        "knowsAbout": [
          "Magasin de bombes de peinture à Lyon",
          "Achat de matériel graffiti et street art à Lyon",
          "Culture Graffiti et Street Art",
          "Technologie des bombes de peinture : Haute et Basse Pression",
          "Gamme Montana Cans (Black, Gold, Tech, Effect)",
          "Chimie des encres et marqueurs : Alcool, Acrylique, Base eau",
          "Outils spécialisés Posca, On The Run, Uni-paint, Grog et Molotow",
          "Choix de buses et caps pour aérosols",
          "Techniques de Street Art : Pochoir, Wildstyle, Handstyle",
          "Préparation de supports pour fresques murales",
          "Équipements de protection et sécurité pour graffeurs",
          "Customisation de baskets et vêtements urbains"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+33478911852",
          "contactType": "customer service",
          "areaServed": "FR",
          "availableLanguage": "French"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.eightyonestore.com/#website",
        "url": "https://www.eightyonestore.com",
        "name": "Eightyone Store",
        "publisher": { "@id": "https://www.eightyonestore.com/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.eightyonestore.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQ_HOME.map(item => ({
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <Categories />
      <BestSellers />
      <InstagramFeed />
      <GoogleReviews />
      <HomeGuidesSection
        title="L'Atelier Eightyone : Conseils & Tutos"
        description="Maîtrisez les techniques de peinture, le choix des caps et l'entretien de vos marqueurs avec nos experts."
      />
      <HomeSEOContent />
    </main>
  );
}