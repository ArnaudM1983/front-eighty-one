"use client";

import { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

type Props = {
  children: React.ReactNode;
  slidesToShow?: number; // Config Desktop par défaut (4)
  autoplay?: boolean;
};

const SlickArrowFix = ({ onClick }: { onClick?: () => void }) => (
  <button type="button" onClick={onClick} className="hidden" aria-label="Bouton technique" />
);

export default function SliderWrapper({
  children,
  slidesToShow = 4,
  autoplay = true,
}: Props) {
  const sliderRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  
  // On stocke le nombre de slides calculé manuellement
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      // Logique MANUELLE des breakpoints (plus fiable que la librairie)
      if (window.innerWidth < 640) {
        setCurrentSlidesToShow(1); // Mobile strict
      } else if (window.innerWidth < 1024) {
        setCurrentSlidesToShow(2); // Tablette
      } else {
        setCurrentSlidesToShow(slidesToShow); // Desktop (4)
      }
    };

    // 1. Calcul immédiat au montage
    handleResize();

    // 2. Écoute du redimensionnement
    window.addEventListener("resize", handleResize);

    // Nettoyage
    return () => window.removeEventListener("resize", handleResize);
  }, [slidesToShow]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay,
    autoplaySpeed: 3000,
    nextArrow: <SlickArrowFix />,
    prevArrow: <SlickArrowFix />,
    // IMPORTANT : On utilise NOTRE variable calculée
    slidesToShow: currentSlidesToShow, 
    slidesToScroll: 1,
    // IMPORTANT : On supprime le tableau 'responsive' qui buggait
    responsive: [], 
  };

  // Squelette de chargement (Mobile First pour éviter l'écrasement)
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
        {/* On affiche juste le premier élément pour éviter le layout shift */}
        <div className="h-[450px] bg-gray-50 rounded-2xl animate-pulse" />
        <div className="hidden md:block h-[450px] bg-gray-50 rounded-2xl animate-pulse" />
        <div className="hidden lg:block h-[450px] bg-gray-50 rounded-2xl animate-pulse" />
        <div className="hidden lg:block h-[450px] bg-gray-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative px-1">
      <Slider ref={sliderRef} {...settings} key={currentSlidesToShow}>
        {children}
      </Slider>

      <div className="flex gap-3 mt-4 justify-end">
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="hover:scale-110 transition-transform cursor-pointer"
          aria-label="Afficher l'élément précédent"
        >
          <CircleArrowLeft size={35} color="#333333" strokeWidth={1.2} />
        </button>

        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="hover:scale-110 transition-transform cursor-pointer"
          aria-label="Afficher l'élément suivant"
        >
          <CircleArrowRight size={35} color="#333333" strokeWidth={1.2} />
        </button>
      </div>
    </div>
  );
}