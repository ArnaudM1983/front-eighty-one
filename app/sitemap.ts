import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eightyonestore.com';
const API_URL = process.env.NEXT_PUBLIC_SYMFONY_API_URL || 'http://localhost:8000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. ROUTES STATIQUES & CATÉGORIES (Priorité Haute)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    
    // BOMBES DE PEINTURE
    { url: `${BASE_URL}/bombes-de-peinture`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/bombes-de-peinture/classiques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/bombes-de-peinture/acryliques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/bombes-de-peinture/techniques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/bombes-de-peinture/effets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/bombes-de-peinture/caps`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },

    // MARQUEURS & ENCRES
    { url: `${BASE_URL}/marqueurs-et-encres`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/marqueurs-et-encres/encres`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/marqueurs-et-encres/marqueurs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/marqueurs-et-encres/squeezers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/marqueurs-et-encres/mines-de-rechange`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/marqueurs-et-encres/marqueurs-squeezers-vides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/marqueurs-et-encres/posca-uni-paint`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },

    // URBAN WEAR
    { url: `${BASE_URL}/urban-wear`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/urban-wear/eighty-one`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/urban-wear/jacker`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },

    // ACCESSOIRES
    { url: `${BASE_URL}/accessoires-equipements`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/accessoires-equipements/protections-equipements`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/accessoires-equipements/stickers-books`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // 2. ROUTES DYNAMIQUES (Produits)
  let productRoutes: MetadataRoute.Sitemap = [];
  
  try {
    // On force un _limit très haut pour récupérer TOUS les produits de ton Symfony
    const res = await fetch(`${API_URL}/api/products?_limit=5000`, { 
        cache: 'no-store' 
    });

    if (res.ok) {
      const products = await res.json();

      productRoutes = products.map((product: any) => ({
        url: `${BASE_URL}/produit/${product.slug}`,
        // Utilise le champ updated_at renvoyé par ton sérialiseur Symfony
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
  }

  return [...staticRoutes, ...productRoutes];
}