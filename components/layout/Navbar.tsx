"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import MobileMenu from "../ui/MobileMenu";
import SearchBarOverlay from "../ui/SearchBarOverlay";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  const burgerColor = isHome ? "bg-white" : "bg-black";

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${isHome ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {/* Top banner */}
      <div
        role="status"
        aria-live="polite"
        className="w-full h-5 flex items-center justify-center text-xs font-medium bg-(--secondary) text-black"
      >
        Disponible en Livraison et Click & Collect
      </div>

      {/* Navbar */}
      <div className="w-full px-6 lg:px-16 py-0 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="Retour à la page d'accueil - Eightyone Store" className="py-4">
          <Image
            src={isHome ? "/logo-81.png" : "/logo-81-nb.png"}
            alt="Logo Eightyone Store"
            width={30}
            height={30}
            className="object-contain"
          />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium static h-full">
          <Dropdown
            title="Bombes de peinture"
            href="/bombes-de-peinture"
            description="Un large choix de sprays. Retrouvez les gammes leaders pour vos projets artistiques, du matériel pro aux éditions collectors."
            items={[
              { label: "Classiques", href: "/bombes-de-peinture/classiques" },
              { label: "Acryliques", href: "/bombes-de-peinture/acryliques" },
              { label: "Techniques", href: "/bombes-de-peinture/techniques" },
              { label: "Effets", href: "/bombes-de-peinture/effets" },
              { label: "Caps", href: "/bombes-de-peinture/caps" },
              { label: "Collectors", href: "/bombes-de-peinture/collector" }
            ]}
          />
          <Dropdown
            title="Marqueurs & encres"
            href="/marqueurs-et-encres"
            description="Outils de précision et encres haute performance. Une sélection rigoureuse pour le tag, le dessin technique et la customisation."
            items={[
              { label: "Encres", href: "/marqueurs-et-encres/encres" },
              { label: "Marqueurs", href: "/marqueurs-et-encres/marqueurs" },
              { label: "Squeezers", href: "/marqueurs-et-encres/squeezers" },
              { label: "Marqueurs & squeezers vides", href: "/marqueurs-et-encres/marqueurs-squeezers-vides" },
              { label: "Mines de rechange", href: "/marqueurs-et-encres/mines-de-rechange" },
              { label: "Posca & Uni Paint", href: "/marqueurs-et-encres/posca-uni-paint" },
            ]}
          />
          <Dropdown
            title="Accessoires & équipements"
            href="/accessoires-equipements"
            description="Protégez-vous et optimisez votre pratique. Retrouvez masques, gants, stickers et blackbooks pour vos sessions."
            items={[
              { label: "Protections & équipements", href: "/accessoires-equipements/protections-equipements" },
              { label: "Stickers", href: "/accessoires-equipements/stickers-books" },
              { label: "Books", href: "/accessoires-equipements/books" }
            ]}
          />
          <Dropdown
            title="Urban wear"
            href="/urban-wear"
            description="Le style Eightyone Store au quotidien. Découvrez notre sélection textile et accessoires streetwear directement inspirés de la culture graffiti."
            items={[
              { label: "Eighty One", href: "/urban-wear/eighty-one" },
              { label: "Montana Cans", href: "/urban-wear/montana-cans" }
            ]}
          />
          
          <Link href="/shop" className="hover:opacity-70 uppercase font-normal flex items-center h-full py-6">
            Le shop
          </Link>
          <Link href="/guides" className="hover:opacity-70 uppercase font-normal flex items-center h-full py-6">
            Guides
          </Link>
        </nav>

        {/* Icônes droite + Burger */}
        <div className="flex items-center gap-8 py-4">
          <div className="flex items-center gap-4">
            <button data-search-button aria-label="Rechercher" className="hover:opacity-70" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-7 h-7 cursor-pointer" strokeWidth={1} />
            </button>

            <button aria-label="Ouvrir le panier" className="hover:opacity-70 relative" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="w-7 h-7 cursor-pointer" strokeWidth={1} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--primary) text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <button
            className="lg:hidden relative w-10 h-10 focus:outline-none z-50 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className={`absolute block h-0.5 w-8 ${burgerColor} rounded-full transition-transform duration-300 ${isOpen ? "rotate-45" : "translate-y-[-6px]"}`}></span>
            <span className={`absolute block h-0.5 w-8 ${burgerColor} rounded-full transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`absolute block h-0.5 w-8 ${burgerColor} rounded-full transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}></span>
          </button>
        </div>
      </div>

      <SearchBarOverlay isOpen={searchOpen} isHome={isHome} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} close={() => setCartOpen(false)} />
      <MobileMenu
        isOpen={isOpen}
        isHome={isHome}
        closeMenu={() => setIsOpen(false)}
        sections={[
          {
            title: "Bombes de peinture",
            items: [
              { label: "Classiques", href: "/bombes-de-peinture/classiques" },
              { label: "Acryliques", href: "/bombes-de-peinture/acryliques" },
              { label: "Techniques", href: "/bombes-de-peinture/techniques" },
              { label: "Effets", href: "/bombes-de-peinture/effets" },
              { label: "Caps", href: "/bombes-de-peinture/caps" },
              { label: "Collectors", href: "/bombes-de-peinture/collector" }
            ],
          },
          {
            title: "Marqueurs & encres",
            items: [
              { label: "Encres", href: "/marqueurs-et-encres/encres" },
              { label: "Marqueurs", href: "/marqueurs-et-encres/marqueurs" },
              { label: "Squeezers", href: "/marqueurs-et-encres/squeezers" },
              { label: "Vides", href: "/marqueurs-et-encres/marqueurs-squeezers-vides" },
              { label: "Mines de rechange", href: "/marqueurs-et-encres/mines-de-rechange" },
              { label: "Posca & Uni Paint", href: "/marqueurs-et-encres/posca-uni-paint" },
            ],
          },
          {
            title: "Urban wear",
            items: [
              { label: "Eighty One", href: "/urban-wear/eighty-one" },
              { label: "Montana Cans", href: "/urban-wear/montana-cans" },
            ],
          },
          {
            title: "Accessoires & équipements",
            items: [
              { label: "Protections & équipements", href: "/accessoires-equipements/protections-equipements" },
              { label: "Stickers", href: "/accessoires-equipements/stickers-books" },
              { label: "Books", href: "/accessoires-equipements/books" }
            ],
          },
          { title: "Le shop", href: "/shop" },
          { title: "Guides", href: "/guides" },
        ]}
      />
    </header>
  );
};

export default Navbar;