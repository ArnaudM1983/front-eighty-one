"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

type DropdownItem = {
  label: string;
  href: string;
};

type Props = {
  title: string;
  href: string;
  items: DropdownItem[];
  description?: string; // Prop optionnelle pour personnaliser le texte
};

export default function Dropdown({ title, href, items, description }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Texte par défaut si aucune description spécifique n'est passée
  const fallbackDescription = `Sélection premium Eightyone Store. Retrouvez les meilleures références de ${title.toLowerCase()} pour vos projets artistiques, du matériel pro au lifestyle.`;

  return (
    <div className="static group flex items-center h-full">
      {/* Lien parent (Titre du menu dans la Navbar) */}
      <Link
        href={href}
        className={`
          hover:opacity-70 uppercase font-normal flex items-center gap-1 py-6
          ${isHome ? "text-white" : "text-black"}
        `}
      >
        {title} 
        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
      </Link>

      {/* Mega Dropdown Container (Pleine largeur) */}
      <div
        className={`
          absolute left-0 top-full w-full
          opacity-0 invisible -translate-y-2
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-300 ease-out z-50 shadow-2xl
          ${isHome ? "bg-black text-white" : "bg-white text-black"}
        `}
      >
        {/* Contenu centré */}
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6">
          
          {/* 1. Ligne du haut : Infos Catégorie */}
          <div className="mb-8 pb-6 border-b border-gray-500/20">
            <h3 className={`text-2xl font-bold uppercase tracking-tighter ${isHome ? "text-white!" : "text-black!"}`}>
              {title}
            </h3>
            
            <div className="flex justify-between items-end gap-10 mt-2">
              <p className={`text-sm max-w-2xl leading-relaxed ${isHome ? "text-gray-400" : "text-gray-500"}`}>
                {description || fallbackDescription}
              </p>
              <Link 
                href={href} 
                className={`text-xs font-bold underline uppercase tracking-widest hover:opacity-70 whitespace-nowrap pb-1 ${isHome ? "text-white" : "text-black"}`}
              >
                Tout voir
              </Link>
            </div>
          </div>

          {/* 2. Ligne du bas : Liens répartis en 4 colonnes */}
          <div className="grid grid-cols-4 gap-x-12 gap-y-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-sm font-medium transition-all duration-200 py-1
                  ${isHome ? "text-white hover:text-gray-400" : "text-black hover:text-(--primary)"}
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}