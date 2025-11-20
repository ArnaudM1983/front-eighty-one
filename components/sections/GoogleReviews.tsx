"use client"

import { useEffect } from "react";

type Props = {};

const GoogleReviews = (props: Props) => {
  useEffect(() => {
    if (!document.querySelector('#featurable-script')) {
      const script = document.createElement("script");
      script.src = "https://featurable.com/assets/v2/carousel_default.min.js";
      script.defer = true;
      script.charset = "UTF-8";
      script.id = "featurable-script";
      document.body.appendChild(script);

      script.onload = () => {
        // Si Featurable expose une fonction pour refresh / recalculer
        if ((window as any).Featurable && (window as any).Featurable.reload) {
          (window as any).Featurable.reload();
        }
      };
    } else {
      if ((window as any).Featurable && (window as any).Featurable.reload) {
        (window as any).Featurable.reload();
      }
    }
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
