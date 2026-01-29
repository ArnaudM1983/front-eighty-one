import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eightyonestore.com';

  return {
    rules: {
      userAgent: '*',
      // On autorise tout le site par défaut
      allow: '/',
      // On interdit l'indexation des pages sensibles ou inutiles pour Google
      disallow: [
        '/admin',      
        '/compte',     // Espace client
        '/panier',     // Panier d'achat
        '/paiement',   // Tunnel de commande
        '/success',    // Page de confirmation de paiement (très important pour le SEO)
        '/api/',       // Tes routes API Next.js internes
        '/*?*',        // Optionnel : interdit l'indexation des URLs avec paramètres (filtres, recherche) pour éviter le duplicate content
      ],
    },
    // Indique explicitement l'emplacement du sitemap à Google
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}