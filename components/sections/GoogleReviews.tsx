"use client"

import { useEffect } from "react";

type Props = {};

const GoogleReviews = (props: Props) => {
  useEffect(() => {
    // Fonction pour corriger les images et boutons injectés par le widget
    const fixAccessibility = () => {
      const container = document.querySelector('#featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a');
      if (!container) return;

      // 1. Corriger les images sans alt 
      container.querySelectorAll('img:not([alt])').forEach(img => img.setAttribute('alt', ''));

      // 2. Corriger les boutons sans nom 
      container.querySelectorAll('button:not([aria-label])').forEach((btn, i) =>
        btn.setAttribute('aria-label', `Action ${i + 1}`)
      );

      // 3. Corriger les éléments sélectionnables dans les slides cachés
      // On cherche tous les éléments avec aria-hidden="true" injectés par slick
      const hiddenSlides = container.querySelectorAll('[aria-hidden="true"]');
      hiddenSlides.forEach((slide) => {
        // On trouve tous les liens et boutons à l'intérieur
        const focusables = slide.querySelectorAll('a, button');
        focusables.forEach((el) => {
          el.setAttribute('tabindex', '-1'); // Empêche le focus clavier
          el.setAttribute('aria-hidden', 'true'); // Sécurité supplémentaire
        });
      });
    };

    // On observe le DOM pour appliquer le patch dès que le widget se charge
    const observer = new MutationObserver(() => {
      fixAccessibility();
    });

    const widgetContainer = document.querySelector('#featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a');
    if (widgetContainer) {
      observer.observe(widgetContainer, { childList: true, subtree: true });
    }

    if (!document.querySelector('#featurable-script')) {
      const script = document.createElement("script");
      script.src = "https://featurable.com/assets/v2/carousel_default.min.js";
      script.defer = true;
      script.charset = "UTF-8";
      script.id = "featurable-script";
      document.body.appendChild(script);
    }

    return () => observer.disconnect(); // Nettoyage
  }, []);

  return (
    <section className="px-4 py-16 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-xl font-semibold">Témoignages Clients</h2>

        <div
          id="featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a"
          data-featurable-async
          data-location-code="fr"
        ></div>
      </div>
    </section>
  );
};

export default GoogleReviews;
