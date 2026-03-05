"use client";

import { useEffect } from "react";

type Props = {};

const GoogleReviews = (props: Props) => {
  useEffect(() => {
    const widgetId = '#featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a';

    const fixAccessibility = () => {
      const container = document.querySelector(widgetId);
      if (!container) return;

      // 1. FIX BOUTONS FLÈCHES 
      container.querySelectorAll('button').forEach((btn) => {
        if (!btn.getAttribute('aria-label')) {
          const desc = btn.getAttribute('data-featurable-description')?.toLowerCase() || "";
          const isLeft = desc.includes('left') || btn.classList.contains('carousel__btn--left');
          const isRight = desc.includes('right') || btn.classList.contains('carousel__btn--right');
          
          if (isLeft) btn.setAttribute('aria-label', "Avis précédent");
          else if (isRight) btn.setAttribute('aria-label', "Avis suivant");
          else btn.setAttribute('aria-label', "En savoir plus"); 
        }
      });

      // 2. FIX IMAGES (Avatars clients)
      container.querySelectorAll('img:not([alt])').forEach((img, i) => {
        img.setAttribute('alt', `Client Eightyone Store ${i + 1}`);
      });

      // 3. FIX DESCENDANTS SÉLECTIONNABLES 
      // On cible tous les éléments interactifs à l'intérieur de zones aria-hidden
      const hiddenRegions = container.querySelectorAll('[aria-hidden="true"]');
      hiddenRegions.forEach(region => {
        const focusables = region.querySelectorAll('button, a, [tabindex="0"]');
        focusables.forEach(el => {
          el.setAttribute('tabindex', '-1');
        });
      });
    };

    const observer = new MutationObserver(() => {
      fixAccessibility();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (!document.querySelector('#featurable-script')) {
      const script = document.createElement("script");
      script.src = "https://featurable.com/assets/v2/carousel_default.min.js";
      script.defer = true;
      script.id = "featurable-script";
      document.body.appendChild(script);
    }

    setTimeout(fixAccessibility, 1000);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 py-16 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-xl font-semibold mb-8 uppercase italic tracking-tighter">
          Témoignages Clients
        </h2>

        <div
          id="featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a"
          data-featurable-async
          data-location-code="fr"
          className="min-h-[500px] md:min-h-[400px] w-full transition-all"
        ></div>
      </div>
    </section>
  );
};

export default GoogleReviews;