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

type Props = {};

const Navbar = (props: Props) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const burgerColor = isHome ? "bg-white" : "bg-black";

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${isHome ? "bg-black text-white" : "bg-white text-black shadow-sm"}
      `}
    >
      {/* Top banner */}
      <div className="w-full h-5 flex items-center justify-center text-xs text-black font-medium bg-(--secondary)">
        Disponible en Livraison et Click & Collect
      </div>

      {/* Navbar */}
      <div className="w-full px-6 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo-81.png"
            alt="Logo"
            width={30}
            height={30}
            className="object-contain"
          />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex gap-8 text-sm font-medium">
          <Dropdown
            title="Bombes de peinture"
            href="/bombes-de-peinture"
            items={[
              { label: "Classiques", href: "/bombes-de-peinture/classiques" },
              { label: "Acryliques", href: "/bombes-de-peinture/acryliques" },
              { label: "Techniques", href: "/bombes-de-peinture/techniques" },
              { label: "Effets", href: "/bombes-de-peinture/effets" },
              { label: "Caps", href: "/bombes-de-peinture/caps" },
            ]}
          />
          <Dropdown
            title="Marqueurs & encres"
            href="/marqueurs-encres"
            items={[
              { label: "Encres", href: "/marqueurs-encres/encres" },
              { label: "Marqueurs", href: "/marqueurs-encres/marqueurs" },
              { label: "Squeezers", href: "/marqueurs-encres/squeezers" },
              { label: "Vides", href: "/marqueurs-encres/marqueurs-squeezers-vides" },
              { label: "Mines de rechange", href: "/marqueurs-encres/mines-de-rechange" },
              { label: "Posca & Uni Paint", href: "/marqueurs-encres/posca-uni-paint" },
            ]}
          />
          <Dropdown
            title="Urban wear"
            href="/urban-wear"
            items={[{ label: "Eighty One", href: "/urban-wear/eighty-one" }]}
          />
          <Dropdown
            title="Accessoires & équipements"
            href="/accessoires-equipements"
            items={[
              { label: "Protections & équipements", href: "/accessoires-equipements/protections-equipement" },
              { label: "Stickers & Books", href: "/accessoires-equipements/stickers-books" },
            ]}
          />
          <Link href="/shop" className="hover:opacity-70 uppercase font-normal">
            Le shop
          </Link>
        </nav>

        {/* Icônes droite + Burger */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {/* Recherche */}
            <button
              aria-label="Recherche"
              className="hover:opacity-70"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-7 h-7 cursor-pointer" strokeWidth={1} />
            </button>

            {/* Panier */}
            <button
              aria-label="Panier"
              className="hover:opacity-70 relative"
              onClick={() => setCartOpen(true)} 
            >
              <ShoppingBag className="w-7 h-7 cursor-pointer" strokeWidth={1} />
              <span className="absolute -top-2 -right-2 bg-(--primary) text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Burger mobile */}
          <button
            className="lg:hidden relative w-10 h-10 focus:outline-none z-50 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className={`absolute block h-0.5 w-8 ${burgerColor} rounded-full transition-transform duration-300 ease-in-out ${isOpen ? "rotate-45" : "translate-y-[-6px]"}`}></span>
            <span className={`absolute block h-0.5 w-8 ${burgerColor} rounded-full transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`absolute block h-0.5 w-8 ${burgerColor} rounded-full transition-transform duration-300 ease-in-out ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}></span>
          </button>
        </div>
      </div>

      {/* Search bar intégrée avec flou derrière */}
      <SearchBarOverlay isOpen={searchOpen} isHome={isHome} />

      {/* CartDrawer */}
      <CartDrawer isOpen={cartOpen} close={() => setCartOpen(false)}>
        {/* Liste des items du panier */}
      </CartDrawer>

      {/* Mobile Menu */}
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
            ],
          },
          {
            title: "Marqueurs & encres",
            items: [
              { label: "Encres", href: "/marqueurs-encres/encres" },
              { label: "Marqueurs", href: "/marqueurs-encres/marqueurs" },
              { label: "Squeezers", href: "/marqueurs-encres/squeezers" },
              { label: "Vides", href: "/marqueurs-encres/marqueurs-squeezers-vides" },
              { label: "Mines de rechange", href: "/marqueurs-encres/mines-de-rechange" },
              { label: "Posca & Uni Paint", href: "/marqueurs-encres/posca-uni-paint" },
            ],
          },
          {
            title: "Urban wear",
            items: [{ label: "Eighty One", href: "/urban-wear/eighty-one" }],
          },
          {
            title: "Accessoires & équipements",
            items: [
              { label: "Protections & équipements", href: "/accessoires-equipements/protections-equipement" },
              { label: "Stickers & Books", href: "/accessoires-equipements/stickers-books" },
            ],
          },
          { title: "Le shop", href: "/shop" },
        ]}
      />
    </header>
  );
};

export default Navbar;
