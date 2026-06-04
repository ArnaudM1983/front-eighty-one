"use client";

import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Check } from "lucide-react";

// Types des avis
interface Review {
  id: number;
  author: string;
  avatarInitials: string;
  rating: number;
  date: string;
  text: string;
  source: string;
  details: string; // Ex: "1 avis", "Local Guide · 37 avis"
}

// 8 avis réels fournis par l'utilisateur
const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    author: "Alexandre Mermet-burnet",
    avatarInitials: "AM",
    rating: 5,
    date: "Il y a 11 mois",
    details: "1 avis",
    text: "Commande reçue très rapidement, super service ! Le personnel est vraiment sympa et à l’écoute. Les bombes sont de qualité, bien emballées. Je recommande à 100 % ! (Je repasserais commande sans hésiter !)",
    source: "Google",
  },
  {
    id: 2,
    author: "Jérômine Mercier",
    avatarInitials: "JM",
    rating: 5,
    date: "Il y a 4 mois",
    details: "4 avis",
    text: "Super expérience ! De très bons conseils et personnels adorables !",
    source: "Google",
  },
  {
    id: 3,
    author: "Tom GASPAR GOMEZ",
    avatarInitials: "TG",
    rating: 5,
    date: "Il y a 11 mois",
    details: "7 avis · 4 photos",
    text: "Meilleur shop de bombe à peinture de Lyon au meilleur prix, conseils, techniques, accueilli par une équipe au top 🎨",
    source: "Google",
  },
  {
    id: 4,
    author: "Candice Guermonprez",
    avatarInitials: "CG",
    rating: 5,
    date: "Il y a 8 mois",
    details: "3 avis",
    text: "D’excellents conseils, une grande gentillesse et un résultat superbe ! Un immense merci !",
    source: "Google",
  },
  {
    id: 5,
    author: "Z69M",
    avatarInitials: "ZM",
    rating: 5,
    date: "Il y a 7 mois",
    details: "1 avis",
    text: "Vrai shop de passionnés, merci pour l'accueil et pour la force. Best Neighbor in Town !!",
    source: "Google",
  },
  {
    id: 6,
    author: "Thomas Demaison",
    avatarInitials: "TD",
    rating: 5,
    date: "Il y a un an",
    details: "9 avis · 2 photos",
    text: "Une pépite dans l’esprit “street” sur Lyon. Je recommande fortement pour la qualité des produits graph, markers, etc… et également pour la qualité des conseils. Ils ont une belle gamme de streetwear. Un magasin bien achalandé avec une large gamme de stock !!",
    source: "Google",
  },
  {
    id: 7,
    author: "lina Chermat",
    avatarInitials: "LC",
    rating: 5,
    date: "Il y a un an",
    details: "9 avis",
    text: "Super magasin, avec un large choix de couleurs et question qualité prix il n’y a rien à dire ! Sans oublier les bons conseils des vendeurs, je recommande !!! Rendu exceptionnel",
    source: "Google",
  },
  {
    id: 8,
    author: "Bernard Lavilliers",
    avatarInitials: "BL",
    rating: 5,
    date: "Il y a 2 ans",
    details: "Local Guide · 37 avis",
    text: "Ici on a affaire à des vendeurs passionnés, à qui on peut demander des conseils ou recommandations, et on sera toujours accueilli dans la bonne humeur et la bienveillance. Niveau tarif les prix sont intéressants, et il y a un large choix. J'aime beaucoup cette boutique.",
    source: "Google",
  },
];

const GoogleReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || clientWidth;
      const gap = 24; // 6 * 4px gap-6
      
      // Calcule le défilement équivalent à une largeur de carte + le gap
      const step = direction === "left" 
        ? -(cardWidth + gap) 
        : (cardWidth + gap);
      
      scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 py-20 bg-[var(--background-secondary)] overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* En-tête de la section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                <Check size={12} className="stroke-[3]" /> Avis Google vérifiés
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase italic">
              Témoignages Clients
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Ce que nos clients lyonnais et en ligne pensent de notre shop graffiti.
            </p>
          </div>

          {/* Score Global */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-500 font-black text-lg">
              4.8
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < 4 ? "fill-amber-400 stroke-amber-400" : "fill-amber-400 stroke-amber-400 opacity-80"}
                  />
                ))}
              </div>
              <p className="text-xs font-black text-slate-700 mt-1 uppercase tracking-wider">
                4.8/5 • 172 avis Google
              </p>
            </div>
          </div>
        </div>

        {/* Carrousel */}
        <div className="relative group">
          
          {/* Boutons de contrôle (cachés sur mobile, affichés au survol sur desktop) */}
          <button
            onClick={() => scroll("left")}
            aria-label="Avis précédent"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100 md:translate-x-0 -translate-x-2"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Avis suivant"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100 md:translate-x-0 translate-x-2"
          >
            <ChevronRight size={20} />
          </button>

          {/* Grille défilante */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {REVIEWS_DATA.map((review) => (
              <div
                key={review.id}
                className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
              >
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group/card hover:-translate-y-1">
                  
                  {/* Guillemet décoratif */}
                  <span className="absolute top-2 right-4 text-7xl select-none font-serif text-slate-50/80 group-hover/card:text-slate-100 transition-colors pointer-events-none font-bold">
                    “
                  </span>

                  <div>
                    {/* Header de la carte */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                        {review.avatarInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">
                          {review.author}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          {review.details}
                        </p>
                      </div>
                    </div>

                    {/* Étoiles de la note */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-amber-400 stroke-amber-400"
                        />
                      ))}
                    </div>

                    {/* Texte du témoignage */}
                    <blockquote className="text-slate-600 text-sm leading-relaxed italic pr-2 font-medium">
                      "{review.text}"
                    </blockquote>
                  </div>

                  {/* Footer de la carte */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-6">
                    <span className="text-[11px] text-slate-400 font-bold">
                      {review.date}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 uppercase tracking-wider">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.833 0-8.75-3.87-8.75-8.514s3.917-8.514 8.75-8.514c2.449 0 4.537.868 6.136 2.427l3.226-3.226C18.666 1.24 15.683 0 12.24 0 5.48 0 0 5.373 0 12s5.48 12 12.24 12c7.054 0 11.73-4.959 11.73-11.932 0-.814-.074-1.423-.236-1.783H12.24z"/>
                      </svg>
                      {review.source}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lien d'appel à l'action */}
        <div className="flex justify-center mt-6">
          <a
            href="https://maps.app.goo.gl/pXLeBiCaUixvJLJn9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-md transition-all active:scale-95"
          >
            Voir tous les avis sur Google
          </a>
        </div>

      </div>
    </section>
  );
};

export default GoogleReviews;