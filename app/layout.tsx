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

const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eightyone Store - Matériel de graffiti et d'arts graphiques à Lyon",
  description: "Matériel de graffiti et d'arts graphiques à Lyon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${roboto.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <CartProvider>
          <Navbar />
          <Main>{children}</Main>
          <Footer />
          {/* Toasts */}
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
        </CartProvider>
      </body>
    </html>
  );
}
