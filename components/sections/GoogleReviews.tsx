"use client";

import { useEffect } from "react";

type Props = {};

const GoogleReviews = (props: Props) => {
  useEffect(() => {
    const widgetId = '#featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a';

    const fixAccessibility = () => {
      const container = document.querySelector(widgetId);
      if (!container) return;

      // 1. SEO & Accessibilité : Remplir les alt vides (Lighthouse déteste les alt="")
      container.querySelectorAll('img').forEach((img, i) => {
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', `Photo client avis Google ${i + 1}`);
        }
      });

      // 2. Accessibilité : Nommer les boutons (flèches du slider)
      container.querySelectorAll('button:not([aria-label])').forEach((btn) => {
        const isLeft = btn.classList.contains('carousel__btn--left') || btn.innerHTML.includes('left');
        btn.setAttribute('aria-label', isLeft ? "Avis précédent" : "Avis suivant");
      });

      // 3. ARIA : Empêcher le focus sur les slides invisibles (Slick Clones)
      const focusablesHidden = container.querySelectorAll('[aria-hidden="true"] a, [aria-hidden="true"] button');
      focusablesHidden.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    };

    const observer = new MutationObserver((mutations) => {
      fixAccessibility();
    });

    // On observe le body au cas où le container n'est pas encore rendu par React
    observer.observe(document.body, { childList: true, subtree: true });

    if (!document.querySelector('#featurable-script')) {
      const script = document.createElement("script");
      script.src = "https://featurable.com/assets/v2/carousel_default.min.js";
      // On utilise defer pour ne pas bloquer le thread principal (Améliore le TBT)
      script.defer = true;
      script.id = "featurable-script";
      document.body.appendChild(script);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 py-16 bg-(--background-secondary)">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-xl font-semibold mb-8 uppercase italic tracking-tighter">
          Témoignages Clients
        </h2>

        {/* FIX CLS : On définit une hauteur minimale pour "réserver" la place.
            Sans cela, la div fait 0px puis saute à 400px d'un coup.
        */}
        <div
          id="featurable-71c4534e-1fe6-44ae-b3a4-4c907149a04a"
          data-featurable-async
          data-location-code="fr"
          className="min-h-[450px] md:min-h-[380px] w-full transition-all duration-300"
          style={{ containIntrinsicSize: '450px', contentVisibility: 'auto' }}
        ></div>
      </div>
    </section>
  );
};

export default GoogleReviews;