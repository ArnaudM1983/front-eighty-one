import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eightyonestore.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',      
        '/compte',     
        '/panier',     
        '/paiement',   
        '/success',    
        '/api/',       
        '/*?*',        
        // --- Ajouts pour nettoyer l'ancien WooCommerce ---
        '/wp-content/',
        '/wp-includes/',
        '/wp-admin/',
        '/wp-*.php',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}