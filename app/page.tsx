import type { Metadata } from "next";
import BestSellers from "@/components/sections/BestSellers"
import { Categories } from "@/components/sections/Categories"
import GoogleReviews from "@/components/sections/GoogleReviews"
import Hero from "@/components/sections/Hero"
import InstagramFeed from "@/components/sections/InstagramFeed"

export const metadata: Metadata = {
  title: "Eightyone Store | Bombes de Peinture Graffiti & Arts à Lyon et en Ligne",
  description:
    "Le spécialiste graffiti à Lyon depuis 2008. Vente de bombes Montana, Double-A, marqueurs, squeezers et encres. Livraison rapide en France ou retrait au shop !",
};

export default function Page() {
  // Définition du schéma JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Eightyone Store",
    "image": "https://www.eightyonestore.com/logo-81.png", 
    "description": "Magasin spécialisé en graffiti et arts graphiques à Lyon et vente en ligne dans toute la France.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "21 Rue des Capucins", 
      "addressLocality": "Lyon",
      "postalCode": "69001",
      "addressCountry": "FR"
    },
    "priceRange": "€€",
    "telephone": "04 78 91 18 52",
    "url": "https://www.eightyonestore.com"
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
    </main>
  )
}