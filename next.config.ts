import type { NextConfig } from "next";
import redirectsData from "./redirects.json";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-eightyone.com',
      },
      {
        protocol: 'https',
        hostname: 'eightyonestore.com',
      },
      // Ajout pour voir les images des produits en local
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000'
      }
    ],
  },

  // --- LE REVERSE PROXY DYNAMIQUE ---
  async rewrites() {
    // On récupère l'URL de l'API selon l'environnement (Local ou Prod)
    // S'il n'y a pas de variable (ex: bug Vercel), on met la prod par défaut par sécurité
    const apiUrl = process.env.NEXT_PUBLIC_SYMFONY_API_URL || 'https://api-eightyone.com';

    return [
      {
        source: '/api-proxy/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },

};

export default nextConfig;