"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import GuideCard from "@/components/ui/GuideCard";

// Fonction utilitaire pour nettoyer les chaînes de caractères (minuscules + sans accents)
const normalizeString = (str: string) => {
  if (!str) return "";
  return str
    .normalize("NFD") // Sépare les lettres de leurs accents
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .toLowerCase()
    .trim();
};

export default function GuidesList({ initialGuides }: { initialGuides: any[] }) {
  const [search, setSearch] = useState("");

  const filteredGuides = useMemo(() => {
    const searchTerms = normalizeString(search)
      .split(/\s+/) // Sépare par les espaces
      .filter((term) => term.length > 0); // Enlève les mots vides

    if (searchTerms.length === 0) return initialGuides;

    return initialGuides.filter((guide) => {
      const titleClean = normalizeString(guide.title);
      const descClean = normalizeString(guide.description);
      const combinedText = `${titleClean} ${descClean}`; 

      // Vérification que TOUS les mots recherchés sont présents dans le texte (dans n'importe quel ordre)
      return searchTerms.every((term) => combinedText.includes(term));
    });
  }, [search, initialGuides]);

  return (
    <div>
      {/* Barre de recherche minimaliste */}
      <div className="mb-12 border-b border-gray-300 pb-2">
        <div className="relative">
          {/* Icône loupe */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <Search size={24} />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Un conseil ? Un problème technique ? (ex: vélo, marqueur, coulure...)"
            className="w-full pl-10 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none caret-black text-md"
          />
        </div>
      </div>

      {/* Grille des résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredGuides.map((guide: any) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredGuides.length === 0 && (
        <div className="text-center py-20 border border-gray-200 bg-white mt-8 rounded-lg shadow-sm">
          <p className="text-xl font-bold text-gray-900 mb-2">
            Désolé, l'expert n'a pas encore traité ce sujet.
          </p>
          <p className="text-gray-600">
            Essayez un autre mot-clé ou passez directement nous voir au shop !
          </p>
        </div>
      )}
    </div>
  );
}