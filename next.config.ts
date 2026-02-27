import type { NextConfig } from "next";

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
        hostname: 'api-eightyone.com', // Mise à jour pour tes images produits
      },
      {
        protocol: 'https',
        hostname: 'eightyonestore.com', // Pour anticiper la bascule du domaine final
      },
    ],
  },
  // --- LE REVERSE PROXY POUR FIXER LE PANIER SUR SAFARI ---
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        // On utilise l'URL de ton API o2switch
        destination: 'https://api-eightyone.com/:path*', 
      },
    ]
  },
};

export default nextConfig;