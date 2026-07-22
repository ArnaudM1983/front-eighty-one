import type { Metadata } from "next";
import BestSellers from "@/components/sections/BestSellers"
import { Categories } from "@/components/sections/Categories"
import GoogleReviews from "@/components/sections/GoogleReviews"
import Hero from "@/components/sections/Hero"
import InstagramFeed from "@/components/sections/InstagramFeed"
import HomeSEOContent from "@/components/sections/HomeSEOContent";
import HomeGuidesSection from "@/components/sections/HomeGuidesSection";

export const metadata: Metadata = {
  title: "Eightyone Store | Bombes de Peinture Graffiti & Arts à Lyon et en Ligne",
  description:
    "Le spécialiste graffiti à Lyon depuis 2008. Vente de bombes Montana, Double-A, marqueurs, squeezers et encres. Livraison rapide en France ou retrait au shop !",
};

export default function Page() {
  // Définition du schéma JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": "https://www.eightyonestore.com/#organization",
        "name": "Eightyone Store",
        "url": "https://www.eightyonestore.com",
        "logo": "https://www.eightyonestore.com/logo-81.png",
        "image": "https://www.eightyonestore.com/store-front.webp", // Photo réelle du shop 
        "description": "Le spécialiste graffiti à Lyon depuis 2008. Vente de bombes de peinture (Montana, Double-A), marqueurs, encres et matériel d'art.",
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
        // PREUVE SOCIALE : Reseaux sociaux
        "sameAs": [
          "https://www.instagram.com/81store/",
          "https://www.facebook.com/eighty-one-store",
          "https://maps.app.goo.gl/pXLeBiCaUixvJLJn9" // Lien Google Business
        ],
        // EXPERTISE : Indique explicitement ce que l'IA doit savoir
        "knowsAbout": [
          "Magasin de bombes de peinture à Lyon",
          "Achat de matériel graffiti et street art à Lyon",
          "Culture Graffiti et Street Art",
          "Technologie des bombes de peinture : Haute et Basse Pression",
          "Gamme Montana Cans (Black, Gold, Tech, Effect)",
          "Chimie des encres et marqueurs : Alcool, Acrylique, Base eau",
          "Outils spécialisés Posca, On The Run, Uni-paint, Infamy et Molotow",
          "Choix de buses et caps pour aérosols",
          "Techniques de Street Art : Pochoir, Wildstyle, Handstyle",
          "Préparation de supports pour fresques murales",
          "Équipements de protection et sécurité pour graffeurs",
          "Customisation de baskets et vêtements urbains"
        ],
        // SERVICE CLIENTS
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
      }
    ]
  };

  return (
    <main>
      {/* Insertion du JSON-LD pour Google */}
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
  )
}