import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Main from "@/components/layout/Main";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "@/context/CartContext";
import CookieBanner from "@/components/layout/CookieBanner";
import MaintenanceMode from "@/components/layout/MaintenanceMode"; // Importez le nouveau composant
import { Analytics } from "@vercel/analytics/next";

const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eightyone Store - Matériel de graffiti et d'arts graphiques à Lyon",
  description: "81 Store : Expert graffiti & arts depuis 2008. Bombes de peinture Montana, marqueurs et matériel pro au meilleur prix. Livraison rapide ou retrait à Lyon. Le shop n°1.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérification du mode maintenance
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  return (
    <html lang="fr">
      <body className={`${roboto.variable} font-sans min-h-screen flex flex-col antialiased`}>
        {isMaintenance ? (
          <MaintenanceMode />
        ) : (
          <CartProvider>
            <Navbar />
            <Main>{children}</Main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
            />
            <CookieBanner />
          </CartProvider>
        )}

        <Analytics />
      </body>
    </html>
  );
}